import React from "react";
import "./styles/UpperPart.css";
import tether from "../web3/Assets/Image/Tether.png";
import JackPot from "../web3/Assets/Image/jackpot2.png";
import { Assets } from "../web3/Assets/assets.js";
import { useBalance } from "wagmi";

const UpperPart = () => {
  const supportedNetwork = 56;
  const lotteryContract = Assets[supportedNetwork].lotteryPaycontract;
  const USDTAddress = Assets[supportedNetwork].USDTTokenAddress;

  const { data } = useBalance({
    address: lotteryContract,
    token: USDTAddress,
    chainId: supportedNetwork,
  });
  return (
    <div className="Header">
      <div>
        <img alt="#" src={JackPot} className="jackPotImage" />
      </div>
      <div className="headerRight">
        <div className="noOfJAckpot">
          <p className="jktext">{data && <span>{data.formatted}</span>}</p>
        </div>
        <img alt="#" src={tether} className="tetherImage" />
      </div>
    </div>
  );
};

export default UpperPart;
