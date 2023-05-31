import { erc20ABI } from "wagmi";
import { Assets } from "../Assets/assets";
import {
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import React from "react";

import { toast } from "react-toastify";
/**
 * Make an Approval of funds so  lottery SmartContract can spend funds
 * @returns states while preparing, writing, and mining the transaction along with the transaction data
 */

// Approve_token : Asking approval amount from connected user
const Approve_token = 10000000000000000000000000000000000n;
export function useApprove() {
  const { chain } = useNetwork();
  const chainId = chain.id;
  const token = Assets[chainId];
  const { config, error: prepareError } = usePrepareContractWrite({
    address: token.USDTTokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [token.lotteryPaycontract, Approve_token],
  });
  let blockExplorer = undefined;
  const {
    data: writeData,
    write: approve,
    error: writeError,
    isLoading: isWriting,
  } = useContractWrite(config);

  const {
    data: mineData,
    isLoading: isMining,
    error: mineError,
    isSuccess: isMined,
  } = useWaitForTransaction({
    hash: writeData?.hash,
    confirmations: 5,
  });

  const hash = writeData?.hash;
  let error = writeError || prepareError || mineError;
  const isSuccess = mineData?.status === 1;
  if (mineData?.status === 0) {
    const txError = new Error("Transaction mined with error status.");
    error = error || txError;
  }
  React.useEffect(() => {
    if (error) {
      toast.error("Unable to approve the token");
    }
    if (isMined) {
      toast.success("Successfully Provided allowance");
    }
  }, [error, isMined]);

  return {
    isMining,
    isWriting,
    error,
    isSuccess,
    isMined,
    // isChainSupported: isSupported,
    hash,
    approve,
    blockExplorer,
  };
}
