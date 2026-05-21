interface PlayerSelectorProps {
  isTitans: boolean;
  players: number[];
  playerCount: number;
  setPlayerCount: (count: number) => void;
}

export function PlayerSelector({
  isTitans,
  players,
  playerCount,
  setPlayerCount,
}: PlayerSelectorProps) {
  return (
    <div className="player-selector">
      <div className="player-text">Players:</div>
      {players.map((count) => (
        <div
          key={count}
          className={[
            "player-item",
            playerCount === count ? "selected" : "",
            !isTitans && count === 6 ? "disabled" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setPlayerCount(count)}
        >
          {count}
        </div>
      ))}
    </div>
  );
}
