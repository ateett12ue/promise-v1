const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Successful DAO Launch", function () {
  let hub,
    collateralToken,
    deployer,
    funder,
    contributor1,
    contributor2,
    contributor3,
    manager;

  before("deploy", async () => {
    const accounts = await hre.ethers.getSigners();
    deployer = accounts[0];
    funder = accounts[1];
    contributor1 = accounts[2];
    contributor2 = accounts[3];
    contributor3 = accounts[4];
    manager = accounts[5];
    const Hub = await ethers.getContractFactory("Hub");
    hub = await Hub.deploy();
    await hub.deployed();
    const CollateralToken = await ethers.getContractFactory("CollateralToken");
    collateralToken = await CollateralToken.deploy("Collateral Token", "CLT");
    collateralToken.transfer(funder.address, 50);
    collateralToken.transfer(manager.address, 50);

    await collateralToken.deployed();
  });

  it("launches a DAO successfully", async function () {
    const launchDaoTx = await hub.launchDAO(
      1000,
      200,
      collateralToken.address,
      "DAO Token",
      "DAO"
    );

    // wait until the transaction is mined
    await launchDaoTx.wait();

    expect(await hub.getCollateralLockedAmount(1)).to.equal(0);
    expect(await hub.getDaoTokenTotalSupply(1)).to.equal(1000);
    expect(
      await hub.getDaoTokenAllocationAmountTowardsContributors(1)
    ).to.equal(200);
    expect(
      await hub.getDaoTokenAllocationPercentageTowardsContributors(1)
    ).to.equal(20);
    expect(await hub.isLockedDaoToken(1)).to.equal(true);

    console.log("dao token address", await hub.getDaoTokenAddress(1));
    console.log("promise token address", await hub.getPromiseTokenAddress(1));
    console.log("vault address", await hub.getVaultAddress(1));
    console.log("hub address", hub.address);
    console.log("collateral token address", collateralToken.address);
    console.log("deployer", deployer.address);
    console.log("funder", funder.address);
    console.log("contributor1", contributor1.address);
    console.log("contributor2", contributor2.address);
    console.log("contributor3", contributor3.address);
  });

  it("funds contributor", async function () {
    const vaultAddress = await hub.getVaultAddress(1);
    const approveTx = await collateralToken
      .connect(funder)
      .approve(vaultAddress, 50);
    await approveTx.wait();

    const fundContributorTx = await hub
      .connect(funder)
      .fundContributor(1, contributor1.address, 10);

    await fundContributorTx.wait();

    expect(await hub.getCollateralLockedAmount(1)).to.equal(10);
    expect(await hub.getPromiseTokensTotalSuppy(1)).to.equal(10);
    expect(
      await hub.getContributorClaimToDaoTokens(1, contributor1.address)
    ).to.equal(200);
  });

  it("funds another contributor", async function () {
    const fundContributorTx = await hub
      .connect(funder)
      .fundContributor(1, contributor2.address, 30);

    await fundContributorTx.wait();

    expect(await hub.getCollateralLockedAmount(1)).to.equal(40);
    expect(await hub.getPromiseTokensTotalSuppy(1)).to.equal(40);
    expect(
      await hub.getContributorClaimToDaoTokens(1, contributor1.address)
    ).to.equal(50);
    expect(
      await hub.getContributorClaimToDaoTokens(1, contributor2.address)
    ).to.equal(150);
  });

  it("burns promise tokens for collateral", async function () {
    const burnPromiseTx = await hub
      .connect(contributor2)
      .burnTokenForCollateral(1, 15);

    await burnPromiseTx.wait();

    expect(await hub.getCollateralLockedAmount(1)).to.equal(25);
    expect(await hub.getPromiseTokensTotalSuppy(1)).to.equal(25);
    expect(
      await hub.getContributorClaimToDaoTokens(1, contributor1.address)
    ).to.equal(50);
    expect(
      await hub.getContributorClaimToDaoTokens(1, contributor2.address)
    ).to.equal(150);
  });
});
