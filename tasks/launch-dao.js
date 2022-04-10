const { hre } = require("@nomiclabs/hardhat-ethers");
const { expect } = require("chai");
const { hubabi } = require("../info/Hub.json");
const { Hub } = require("../info/hub-address.json");
const { CollateralToken } = require("../info/collateral-token-address.json");
const { abi } = require("../info/CollateralToken.json");
const { ethers } = require("ethers");

/*
  contract deployer - 0
  dao deployer (manager) - 1
  funder - 2
  contributor1 - 3
  contributor2 - 4
  contributor3 - 5
*/

function getHub(signer) {
  return new ethers.Contract(Hub, hubabi, signer);
}

function getCollateralToken(signer) {
  return new ethers.Contract(CollateralToken, abi, signer);
}

task("launch-dao", "launches a dao").setAction(async ({}, hre) => {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[1];

  const hub = getHub(deployer);
  const collateralToken = getCollateralToken(deployer);
  const launchDaoTx = await hub.launchDAO(
    1000,
    200,
    collateralToken.address,
    "DAO Token",
    "DAO"
  );

  // wait until the transaction is mined
  await launchDaoTx.wait();

  const allocationTowardContributors =
    await hub.getDaoTokenAllocationAmountTowardsContributors(1);

  const numDAOs = await hub.getNumDAOs();

  console.log(allocationTowardContributors);
  console.log(numDAOs);
});

task("transfer-collateral", "transfers collateral amount")
  .addParam("fromid")
  .addParam("toid")
  .addParam("amount")
  .setAction(async ({ fromid, toid, amount }, hre) => {
    const accounts = await hre.ethers.getSigners();
    const from = accounts[fromid];
    const to = accounts[toid];

    const collateralToken = getCollateralToken(from);
    const transfer = await collateralToken
      .connect(from)
      .transfer(to.address, amount);
    await transfer.wait();

    console.log(
      "balance of sender: ",
      await collateralToken.balanceOf(from.address)
    );
    console.log(
      "balance of receiver: ",
      await collateralToken.balanceOf(to.address)
    );
  });

task("fund-contributor", "funds a contributor")
  .addParam("contributorid")
  .addParam("daoid")
  .addParam("funderid")
  .addParam("amount")
  .setAction(async ({ contributorid, daoid, funderid, amount }, hre) => {
    const accounts = await hre.ethers.getSigners();
    const contributor = accounts[contributorid];
    const funder = accounts[funderid];

    const hub = getHub(funder);
    const collateralToken = getCollateralToken(funder);

    const vaultAddress = await hub.getVaultAddress(1);
    const approveTx = await collateralToken.approve(vaultAddress, 50);
    await approveTx.wait();

    const fundCotributorTx = await hub.fundContributor(
      daoid,
      contributor.address,
      amount
    );

    // wait until the transaction is mined
    await fundCotributorTx.wait();

    const contributorClaim = await hub.getContributorClaimToDaoTokens(
      daoid,
      contributor.address
    );
    const numPromiseTokens = await hub.getPromiseTokensTotalSuppy(daoid);

    console.log(contributorClaim);
    console.log(numPromiseTokens);
  });

task("burn-tokens", "burn promise tokens")
  .addParam("mode")
  .addParam("daoid")
  .addParam("contributorid")
  .addParam("amount")
  .setAction(async ({ mode, daoid, contributorid, amount }, hre) => {
    const accounts = await hre.ethers.getSigners();
    const contributor = accounts[contributorid];

    const hub = getHub(contributor);
    const collateralToken = getCollateralToken(contributor);

    if (mode === "0") {
      const burnTx = await hub.burnTokenForDAOToken(daoid, amount);
      await burnTx.wait();
    } else if (mode === "1") {
      const burnPromiseTx = await hub.burnTokenForCollateral(daoid, amount);
      await burnPromiseTx.wait();
    } else {
      console.log("mode must be 0 or 1");
    }

    const contributorClaim = await hub.getContributorClaimToDaoTokens(
      daoid,
      contributor.address
    );
    const numPromiseTokens = await hub.getPromiseTokensTotalSuppy(daoid);
    const collateralBalance = await collateralToken.balanceOf(
      contributor.address
    );
    const daoTokenBalance = await hub.getDaoTokenBalance(
      daoid,
      contributor.address
    );
    const promiseTokenBalance = await hub.getPromiseTokensBalance(
      daoid,
      contributor.address
    );

    console.log(`contributor claim of dao tokens: ${contributorClaim}`);
    console.log(`number of promise tokens in supply: ${numPromiseTokens}`);
    console.log(
      `balance of collateral tokens in contributor wallet: ${collateralBalance}`
    );
    console.log(
      `balance of dao tokens in contributor wallet: ${daoTokenBalance}`
    );
    console.log(
      `balance of promise tokens in contributor wallet: ${promiseTokenBalance}`
    );
  });

task("unlock-tokens", "unlocks dao tokens")
  .addParam("daoid")
  .addParam("managerid")
  .setAction(async ({ daoid, managerid }, hre) => {
    const accounts = await hre.ethers.getSigners();
    const manager = accounts[managerid];

    const hub = getHub(manager);

    const unlockTx = await hub.unlockDAOTokens(daoid);
    await unlockTx.wait();

    const isLocked = await hub.isLockedDaoToken(daoid);

    console.log(`dao token locked: ${isLocked}`);
  });
