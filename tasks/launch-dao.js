const { hre } = require("@nomiclabs/hardhat-ethers");
//import hubABI from "../info/Hub.json";
//import hubAddress from "../info/hub-address.json";
//import collateralTokenABI from "../info/CollateralToken.json";
//import collateralTokenAddress from "../info/collateral-token-address.json";
const { expect } = require("chai");
const { hubabi } = require("../info/Hub.json");
const { Hub } = require("../info/hub-address.json");
const { CollateralToken } = require("../info/CollateralToken.json");
const { abi } = require("../info/collateral-token-address.json");
const { ethers } = require("ethers");

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
  //const collateralToken = getCollateralToken(deployer);
  //console.log(collateralToken);
  const launchDaoTx = await hub.launchDAO(
    1000,
    200,
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    "DAO Token",
    "DAO"
  );

  // wait until the transaction is mined
  await launchDaoTx.wait();

  expect(await hub.getCollateralLockedAmount(1)).to.equal(0);
  expect(await hub.getDaoTokenTotalSupply(1)).to.equal(1000);
  expect(await hub.getDaoTokenAllocationAmountTowardsContributors(1)).to.equal(
    200
  );
  expect(
    await hub.getDaoTokenAllocationPercentageTowardsContributors(1)
  ).to.equal(20);
  expect(await hub.isLockedDaoToken(1)).to.equal(true);
});
