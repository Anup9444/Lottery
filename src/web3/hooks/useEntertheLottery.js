import { ABI } from "../Assets/ABI";
import { Assets } from "../Assets/assets";
import {
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { BigNumber } from "ethers";
import { errorMessages } from "../errorMessage";
import React from "react";
import { toast } from "react-toastify";
/**
 * Buys ticket from lottery SmartContract for conected user
 * @returns states while preparing, writing, and mining the transaction along with the transaction data
 */
export const useEnterthelottery = (
  uniqueTicket,
  currentRound,
  entryFee,
  mode
) => {
  const { chain } = useNetwork();
  const chainId = chain.id;
  const lotteryPaycontract = Assets[chainId].lotteryPaycontract;
  const totalEntryFee = BigNumber.from(uniqueTicket.length).mul(entryFee);
  let transaction;
  if (mode === 0) {
    transaction = {
      address: lotteryPaycontract,
      abi: ABI,
      functionName: "enter",
      args: [uniqueTicket, currentRound],
      value: totalEntryFee,
    };
  } else {
    transaction = {
      address: lotteryPaycontract,
      abi: ABI,
      functionName: "enter",
      args: [uniqueTicket, currentRound],
    };
  }
  const { config, error: configError } = usePrepareContractWrite(transaction);
  const {
    data: writeData,
    write: enter,
    isLoading: iswritting,
    error: writeError,
  } = useContractWrite(config);

  const {
    data: isMineData,
    isLoading: isMinining,
    isSuccess: isMined,
    error: mineerror,
  } = useWaitForTransaction({
    hash: writeData?.hash,
    confirmations: 3,
  });

  const hash = writeData?.hash;
  const error = configError || writeError || mineerror;
  const isSuccess = isMineData?.status === 1;
  const isLoading = iswritting || isMinining;
  let errorMessage = undefined;
  if (error) {
    errorMessage = errorMessages(error);
  }

  React.useEffect(() => {
    if (error) {
      toast.error("Unable to buy token ");
    }
    if (isMined) {
      toast.success(`Successfully bought ${uniqueTicket.length} tikets`);
    }
  }, [error, isMined, uniqueTicket.length]);

  return {
    hash,
    errorMessage,
    enter,
    isSuccess,
    isLoading,
    isMined,
  };
};
