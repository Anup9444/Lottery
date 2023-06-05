import React, { useEffect } from "react";
import { useAccountModal, useChainModal } from "@rainbow-me/rainbowkit";
import "./styles/ButtonAfterConnecting.css";
import { useNetwork } from "wagmi";
import { useAccount } from "wagmi";
import bscImage from "../web3/Assets/Image/polygon.png";
import { useGetReadData } from "../web3/hooks/useWinner";
import { useEnterthelottery } from "../web3/hooks/useEntertheLottery";
import { useAllowance } from "../web3/hooks/UseAllowance";
import { useApprove } from "../web3/hooks/UseApprove";
import { Assets } from "../web3/Assets/assets";
import { useBalance, useSwitchNetwork } from "wagmi";

import { toast } from "react-toastify";
import ticket from "../web3/Assets/Image/ticket.png";

const { v4: uuidv4 } = require("uuid");

const ButtonAfterConnecting = () => {
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const USDTAddress = Assets[chain.id].USDTTokenAddress;
  const { data, isLoading } = useBalance({
    address: address,
    token: USDTAddress,
  });
  const { switchNetwork } = useSwitchNetwork();
  const [numberOfTickets, setNumberOfTickets] = React.useState("");
  const [uniqueTicket, setUniqueTicket] = React.useState("");

  function generateUniqueIds(n) {
    const uniqueIds = [];
    for (let i = 0; i < n; i++) {
      const uniqueId = uuidv4();
      uniqueIds.push(uniqueId);
    }
    return uniqueIds;
  }

  const handleNumberOfTicketsChange = (event) => {
    if (event.target.value > 10 || event.target.value <= 0) return;
    try {
      setNumberOfTickets(event.target.value);
      setUniqueTicket(generateUniqueIds(event.target.value));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ModalContainer">
      <div className="Address connectedButton ">
        {openAccountModal && (
          <div className="tokencontainer">
            <p className="tokensdata">
              {" "}
              {!isLoading ? (
                data && Number(data.formatted).toFixed(2)
              ) : (
                <>-----</>
              )}
              <span className="tokenName">USDT</span>
            </p>
            <button
              onClick={openAccountModal}
              type="button"
              className="connectedaddress"
            >
              {address.slice(0, 7)}....{address.slice(36, 42)}
            </button>
          </div>
        )}
      </div>
      <div className="connectedButton chainName">
        {openChainModal && (
          <>
            {chain.id === 137 ? (
              <button
                onClick={openChainModal}
                type="button"
                className="actualButton address"
              >
                <div className="ticketsProps">
                  <img alt="#" src={bscImage} className="bscImage" />
                  <span className="polygonBuyTickets">Polygon Mainnet</span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => switchNetwork?.(137)}
                type="button"
                className="actualButton address"
              >
                <span className="polygonBuyTickets">Switch to Polygon</span>
              </button>
            )}
          </>
        )}
      </div>
      <div className="connectedButton buyTickets">
        {isConnected && numberOfTickets ? (
          <GetRoundsAndValue Tickets={uniqueTicket} balance={data.value} />
        ) : (
          <button type="button" className="actualButton address" disabled>
            <div className="ticketsProps">
              <img alt="#" src={ticket} width={70}></img>
              <span className="polygonBuyTickets">Buy Tickets</span>
            </div>
          </button>
        )}
      </div>
      <div className="connectedButton amountOfTickets">
        <label>
          <span className="amountoftickets">Amount Of Tickets</span>
          <input
            type="number"
            value={numberOfTickets}
            onChange={handleNumberOfTicketsChange}
            className="numberInput"
          />
        </label>
      </div>
    </div>
  );
};

const GetRoundsAndValue = ({ Tickets, balance }) => {
  console.log("Tickets , balance", Tickets, balance);
  const { bigCurrentRound, entryFee, mode } = useGetReadData();
  React.useEffect(() => {
    if (Tickets.length * Number(entryFee) > Number(balance)) {
      toast.error("Not enough tokens to buy tickets");
    }
  }, [Tickets.length, entryFee, balance]);

  if (bigCurrentRound && entryFee && mode === 0) {
    return (
      <div>
        <LotteryentryButton
          uniqueTicket={Tickets}
          currentRound={bigCurrentRound}
          entryFee={entryFee}
          mode={mode}
        />
      </div>
    );
  }
  if (bigCurrentRound && entryFee && mode === 1) {
    return (
      <LotteryUSTDentryButton
        Tickets={Tickets}
        bigCurrentRound={bigCurrentRound}
        entryFee={entryFee}
        mode={mode}
      />
    );
  }
  return (
    <button type="button" className="actualButton address" disabled>
      <div className="ticketsProps">
        <img alt="#" src={ticket} width={70}></img>
        <span>Buy Tickets</span>
      </div>
    </button>
  );
};
const LotteryUSTDentryButton = ({
  Tickets,
  bigCurrentRound,
  entryFee,
  mode,
}) => {
  const [needAll, setNeedAll] = React.useState();
  const { needAllowance } = useAllowance(Tickets.length * Number(entryFee));
  const { approve, isLoading, isMining, isWriting, isSuccess, isMined } =
    useApprove();
  useEffect(() => {
    setNeedAll(needAllowance);

    if (isMined) {
      setNeedAll(false);
    }
  }, [isMined, isSuccess, needAllowance]);

  if (needAll) {
    return (
      <Getallowance
        approve={approve}
        isLoading={isLoading}
        isMining={isMining}
        isWriting={isWriting}
        isSuccess={isSuccess}
      />
    );
  }
  return (
    <LotteryentryButton
      uniqueTicket={Tickets}
      currentRound={bigCurrentRound}
      entryFee={entryFee}
      mode={mode}
    />
  );
};

const Getallowance = ({
  approve,
  isLoading,
  isMining,
  isWriting,
  isSuccess,
}) => {
  return (
    <button type="button" className="actualButton address" onClick={approve}>
      <span>
        {isMining && "Processing transaction..."}
        {isWriting && "Redirecting to wallet..."}
        {!isLoading &&
          !isSuccess &&
          !isWriting &&
          "Need to Approve token First"}
        {isSuccess && "Done"}
        {isLoading && "Loading..."}
      </span>
    </button>
  );
};

const LotteryentryButton = ({ uniqueTicket, currentRound, entryFee, mode }) => {
  const { enter, isLoading, isMining, isWriting, isSuccess, errorMessage } =
    useEnterthelottery(uniqueTicket, currentRound, entryFee, mode);
  if (errorMessage) {
    return (
      <button type="button" className="actualButton address" disabled>
        <div className="ticketsProps">
          <img alt="#" src={ticket} width={70}></img>
          <span>Buy Tickets</span>
        </div>
      </button>
    );
  }
  return (
    <button type="button" className="actualButton address" onClick={enter}>
      <div className="ticketsProps">
        <img alt="#" src={ticket} width={70}></img>
        <span>
          {isMining && "Processing transaction..."}
          {isWriting && "Redirecting to wallet..."}
          {!isLoading && !isSuccess && "Buy Tickets"}
          {isSuccess && "Done"}
          {isLoading && "Loading..."}
        </span>
      </div>
    </button>
  );
};

export default ButtonAfterConnecting;
