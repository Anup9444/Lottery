import { useContractRead } from "wagmi";
import { ABI } from "../Assets/ABI";
import { Assets } from "../Assets/assets";

export function useGetReadData() {
  const chainId = 56;
  const lotteryPaycontract = Assets[chainId].lotteryPaycontract;

  const { data, error1, isLoading } = useContractRead({
    address: lotteryPaycontract,
    abi: ABI,
    functionName: "round",
    chainId: chainId,
  });

  const { data: mode, error: error2 } = useContractRead({
    address: lotteryPaycontract,
    abi: ABI,
    functionName: "entryMode",
    chainId: chainId,
  });

  const { data: entryFee, error: error3 } = useContractRead({
    address: lotteryPaycontract,
    abi: ABI,
    functionName: "entryFee",
    chainId: chainId,
  });
  const error = error1 || error2 || error3;
  const bigCurrentRound = data;
  console.log(entryFee, mode, bigCurrentRound, error, lotteryPaycontract);

  return { entryFee, mode, bigCurrentRound, error, isLoading };
}
