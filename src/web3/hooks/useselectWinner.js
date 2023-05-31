import { ABI } from "../Assets/ABI";
import { Assets } from "../Assets/assets";
import {
  useContractWrite,
  useWaitForTransaction,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";

/**
 * only owner of contract can call this method , picks the winner of the lottery
 * @returns states while preparing, writing, and mining the transaction along with the transaction data
 */
export const useSelectWinnerforlottery = () => {
  const { chain } = useNetwork();
  const chainId = chain.id;
  const lotteryPaycontract = Assets[chainId].lotteryPaycontract;
  const { config, error: configError } = usePrepareContractWrite({
    address: lotteryPaycontract,
    abi: ABI,
    functionName: "distributePrize",
  });
  const {
    data: writeData,
    write: selectWinner,
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

  return {
    hash,
    error,
    selectWinner,
    isSuccess,
    isLoading,
    isMined,
  };
};
