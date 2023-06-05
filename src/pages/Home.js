import React from "react";
import UpperPart from "../Components/UpperPart";
import Table from "../Components/Table";
import "./styles/Home.css";
import { CustomButton } from "../Components/CustomButton";
import ButtonAfterConnecting from "../Components/ButtonAfterConnecting";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
const Home = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  return (
    <div className="Home">
      <UpperPart />
      {isConnected ? (
        chain.id === 137 ? (
          <ButtonAfterConnecting />
        ) : (
          <ChangeNetworkButton />
        )
      ) : (
        <div className="buttonContainer">
          <CustomButton />
        </div>
      )}

      <Table />
    </div>
  );
};

const ChangeNetworkButton = () => {
  const { switchNetwork } = useSwitchNetwork();
  return (
    <button
      onClick={() => switchNetwork?.(137)}
      type="button"
      className="ConnectWallet"
    >
      Click to switch into Polygon Network
    </button>
  );
};

export default Home;
