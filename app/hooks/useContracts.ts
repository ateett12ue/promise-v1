import { useEffect, useState } from "react";
import { Hub } from "../../info/hub-address.json";
import { CollateralToken } from "../../info/collateral-token-address.json";
import { abi as hubabi } from "../../info/Hub.json";
import { abi as collabi } from "../../info/CollateralToken.json";
import { ethers } from "ethers";

export function useContracts() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const hub = new ethers.Contract(Hub, hubabi);
  const [collateralToken, setCollateralToken] = useState({} as any);

  const launchDao = async (
    daoTokenName: string,
    daoTokenSymbol: string,
    daoTokenSupply: number,
    collateralTokenAddress: string
  ) => {
    const launchDaoTx = await hub.launchDAO(
      daoTokenSupply,
      200,
      collateralTokenAddress,
      daoTokenName,
      daoTokenSymbol
    );
    setCollateralToken(
      new ethers.Contract(collateralTokenAddress, collabi, provider)
    );

    return await launchDaoTx.wait();
  };

  const fundContributor = async (
    daoid: number,
    contributorAddress: string,
    amount: number
  ) => {
    const fundCotributorTx = await hub.fundContributor(
      daoid,
      contributorAddress,
      amount
    );

    return await fundCotributorTx.wait();
  };

  const unlockTokens = async (daoid: number) => {
    const unlockTx = await hub.unlockDAOTokens(daoid);
    return await unlockTx.wait();
  };

  const burnPromises = async (
    daoid: number,
    amount: number,
    burnFor: string
  ) => {
    if (burnFor === "collateral") {
      const burnPromiseTx = await hub.burnTokenForDAOToken(daoid, amount);
      return await burnPromiseTx.wait();
    } else if (burnFor === "daoToken") {
      const burnPromiseTx = await hub.burnTokenForCollateral(daoid, amount);
      return await burnPromiseTx.wait();
    }
  };

  const approve = async (daoId: number) => {
    const vaultAddress = await hub.getVaultAddress(daoId);
    const approveTx = await collateralToken.approve(
      vaultAddress,
      ethers.constants.MaxInt256
    );
    return await approveTx.wait();
  };

  const getBalance = async (
    token: string,
    daoid: number,
    contributorAddress: string
  ) => {
    if (token === "dao") {
      return await hub.getDaoTokenBalance(daoid, contributorAddress);
    } else if (token === "collateral") {
      return await collateralToken.balanceOf(contributorAddress);
    } else if (token === "promise") {
      return await hub.getPromiseTokenBalance(daoid, contributorAddress);
    }
  };

  const getDAOTokenClaimAmount = async (
    daoId: number,
    contributorAddress: string
  ) => {
    return await hub.getContributorClaimToDaoTokens(daoId, contributorAddress);
  };

  const getDaoTokenAllocation = async (daoId: number) => {
    return await hub.getDaoTokenAllocationAmountTowardsContributors(daoId);
  };

  const getDaoTokenAllocationPercentage = async (daoId: number) => {
    return await hub.getDaoTokenAllocationPercentageTowardsContributors(daoId);
  };

  return {
    launchDao,
    fundContributor,
    unlockTokens,
    burnPromises,
    getBalance,
    approve,
    getDAOTokenClaimAmount,
    getDaoTokenAllocation,
  };
}
