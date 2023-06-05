import { useContractRead } from "wagmi";
import { ABI } from "../Assets/ABI";
import { Assets } from "../Assets/assets";

export function useParticipatedAddress(round) {
  // const { chain } = useNetwork();
  let chainId;

  // if (chain) chainId = chain.id
  chainId = 137;
  const lotteryPaycontract = Assets[chainId].lotteryPaycontract;

  const { data, error, isLoading } = useContractRead({
    address: lotteryPaycontract,
    abi: ABI,
    functionName: "getParticipatedAddress",
    args: [round],
    chainId: chainId,
  });

  const { data: listOfTickets } = useContractRead({
    address: lotteryPaycontract,
    abi: ABI,
    functionName: "listTickets",
    args: [round],
    chainId: chainId,
  });

  return { data, listOfTickets, error, isLoading };
}
