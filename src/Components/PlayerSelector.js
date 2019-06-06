import React from "react";

export const PlayerSelector = (props) => {
  return (
    <ul className="player-selector">
        {[2,3,4,5].map((index) => (
            <li className={ props.playerCount  === index ? "selected" : ""} onClick={() => props.setPlayerCount(index)}>{index}</li>
        ))}
    </ul>
  );
};
