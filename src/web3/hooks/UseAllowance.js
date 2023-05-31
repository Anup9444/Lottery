// Importing required modules
import { erc20ABI } from "wagmi";
import { Assets } from "../Assets/assets";
import { useContractRead, useNetwork } from "wagmi";
import { useAccount } from "wagmi";
import React from "react";

// Function to check allowance
export function useAllowance(amount) {
  // Getting current network chain
  const { chain } = useNetwork();

  // Getting user account address
  const { address } = useAccount();
  const connectedAddress = address;

  // Retrieving chain-specific data
  const chainData = Assets[chain.id];
  const token = chainData.USDTTokenAddress;
  const _decimal = chainData.decimal;

  // Retrieving allowance data from the contract
  const { data, error, isLoading } = useContractRead({
    address: token,
    abi: erc20ABI,
    functionName: "allowance",
    args: [connectedAddress, chainData.lotteryPaycontract],
  });

  let needAllowance = true;

  // Checking if the allowance is sufficient for the desired amount
  if (data) {
    if (amount) needAllowance = Number(data) / _decimal < amount;
  }

  // Returning the relevant data
  return { data, error, needAllowance, isLoading };
}
