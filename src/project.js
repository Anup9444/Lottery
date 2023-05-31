import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEnterthelottery } from "./web3/hooks/useEntertheLottery";
import { useAccount } from "wagmi";
import { useGetReadData } from "./web3/hooks/useWinner";
import { useSelectWinnerforlottery } from "./web3/hooks/useselectWinner";
import { useAllowance } from "./web3/hooks/UseAllowance";
import { useApprove } from "./web3/hooks/UseApprove";
const { v4: uuidv4 } = require("uuid");

const Project = () => {
  const [numberOfTickets, setNumberOfTickets] = React.useState("");
  const [uniqueTicket, setUniqueTicket] = React.useState("");
  const { address } = useAccount();

  const isAdmin = address === "0x9f76Ce21c550D71d3F706ABC497DA5dC32b6F6ab";
  const { isConnected } = useAccount();

  function generateUniqueIds(n) {
    const uniqueIds = [];
    for (let i = 0; i < n; i++) {
      const uniqueId = uuidv4();
      uniqueIds.push(uniqueId);
    }
    return uniqueIds;
  }
  const handleNumberOfTicketsChange = (event) => {
    if (event.target.value > 10 || event.target.value < 0) return;
    setNumberOfTickets(event.target.value);
    setUniqueTicket(generateUniqueIds(event.target.value));
  };

  const renderButtonOrTickets = () => {
    if (isConnected && numberOfTickets) {
      return (
        <>
          <GetRoundsAndValue Tickets={uniqueTicket} />
        </>
      );
    }
  };

  return (
    <div>
      <ConnectButton />
      <div className="pickwinner">
        {renderButtonOrTickets()}
        <input
          type="number"
          value={numberOfTickets}
          onChange={handleNumberOfTicketsChange}
        ></input>
      </div>
      <br></br>
      {isAdmin && <AdminButtons />}
    </div>
  );
};

const GetRoundsAndValue = ({ Tickets }) => {
  const { bigCurrentRound, entryFee, mode, error } = useGetReadData();
  if (bigCurrentRound && entryFee && mode == 0) {
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
  if (bigCurrentRound && entryFee && mode == 1) {
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
    <div className>
      <>Error while retrieving</>
    </div>
  );
};

const LotteryUSTDentryButton = ({
  Tickets,
  bigCurrentRound,
  entryFee,
  mode,
}) => {
  const { needAllowance } = useAllowance(Tickets.length * Number(entryFee));
  if (needAllowance == false) {
    return (
      <LotteryentryButton
        uniqueTicket={Tickets}
        currentRound={bigCurrentRound}
        entryFee={entryFee}
        mode={mode}
      />
    );
  }
  return <Getallowance />;
};
const Getallowance = () => {
  const { approve, isLoading, isMined } = useApprove();

  return (
    <div>
      <button onClick={approve}>
        {isLoading && "Loading..."}
        {!isLoading && !isMined && "Approve the token to spend"}
        {isMined && "successfully accepted"}
      </button>
    </div>
  );
};

const LotteryentryButton = ({ uniqueTicket, currentRound, entryFee, mode }) => {
  const { enter, isLoading, isMined, errorMessage } = useEnterthelottery(
    uniqueTicket,
    currentRound,
    entryFee,
    mode
  );

  return (
    <div>
      <button onClick={enter}>
        {isLoading && "Loading..."}
        {!isLoading && !isMined && "Buy the tickets"}
      </button>
      {/* {errorMessage && <>{errorMessage}</>} */}
    </div>
  );
};

export default Project;

const AdminButtons = () => {
  const { selectWinner, error } = useSelectWinnerforlottery();

  return (
    <>
      <button disabled={error} onClick={selectWinner}>
        Pick Winner
      </button>
    </>
  );
};
