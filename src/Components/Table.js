import React from "react";
import "./styles/Table.css";
import { useGetReadData } from "../web3/hooks/useWinner";
import { useParticipatedAddress } from "../web3/hooks/usePartcipatedAddress";

function Table() {
  const { bigCurrentRound } = useGetReadData();
  const [numberofPlayer, setNumberOfPlayer] = React.useState(0);
  const [numberofTickets, setNumberOfTickets] = React.useState(0);

  return (
    <div className="Table">
      <div className="tableListTopic">
        List Of Players(Total player {numberofPlayer})
      </div>
      <br></br>
      <div className="tableListTopic">
        Total Tickets Bought:{numberofTickets}
      </div>
      <div className="actualList">
        {bigCurrentRound && (
          <ListOfPlayers
            round={bigCurrentRound}
            setNumberOfPlayer={setNumberOfPlayer}
            setNumberOfTickets={setNumberOfTickets}
          ></ListOfPlayers>
        )}
      </div>
    </div>
  );
}

const ListOfPlayers = ({ round, setNumberOfPlayer, setNumberOfTickets }) => {
  const { data, error, listOfTickets, isLoading } =
    useParticipatedAddress(round);
  React.useEffect(() => {
    if (data) {
      setNumberOfPlayer(data.length);
    }
    if (listOfTickets) {
      setNumberOfTickets(listOfTickets.length);
    }
  }, [data, listOfTickets]);

  if (isLoading) {
    return <p className="errortext">- - -- - - -- - - - </p>;
  }
  if (error) {
    return <p className="errortext">Error while retrieving List of player</p>;
  }
  if (data.length === 0) {
    return <p className="errortext">No any Participate at the moment</p>;
  }
  return (
    <ul>
      {data.map((items, index) => (
        <li key={index}>
          <a href={`https://bscscan.com/address/${items}`}>{items}</a>
        </li>
      ))}
    </ul>
  );
};

export default Table;
