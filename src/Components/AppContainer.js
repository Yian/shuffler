import React from "react";
import { CardList } from "./CardList";
import { Checkbox } from "./Checkbox";
import { PlayerSelector } from "./PlayerSelector";
import shuffle from "lodash.shuffle";

const initialGodOrdering = [0, 1, 2, 3];
const players = [3, 4, 5, 6];
const initialTitansOrdering = [0, 1, 2, 3, 4];
const diceValues = [0, 1, 1, 2, 2, 3];

const defaultFavorTiles = [
  { name: "aphrodite", used: false },
  { name: "artemis", used: false },
  { name: "demeter", used: false },
  { name: "dionysos", used: false },
  { name: "hephaistos", used: false },
  { name: "hermes", used: false },
  { name: "hera", used: false },
  { name: "hestia", used: false }
];

const defaultGodTiles = [
  { name: "ares" },
  { name: "athena" },
  { name: "zeus" },
  { name: "poseidon" }
];

const defaultTitansTiles = [
  { name: "ares" },
  { name: "athena" },
  { name: "zeus" },
  { name: "poseidon" },
  { name: "kronos" }
];

export class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screenMode: 1,
      isOptions: false,
      playerCount: 5,
      players,
      cycleCount: 0,
      isTitans: false,
      isHades: false,
      isFavors: false,
      hadesActive: false,
      hadesTotal: 0,
      lastPlayerIndex: 4,
      favorTiles: shuffle(defaultFavorTiles),
      tiles: defaultGodTiles,
      ordering: initialGodOrdering,
      dice1: 1,
      dice2: 1,
      shuffleHistory: [
        {
          cycle: 0,
          order: initialGodOrdering,
          wasShuffled: true
        }
      ]
    };
  }

  incrementCycleCount = () => {
    this.setState({
      cycleCount: this.state.cycleCount + 1
    });
  };

  setPlayerCount = playerCount => {
    var lastPlayerIndex = playerCount - 1;
    var tilesToUse = this.state.isTitans ? defaultTitansTiles : defaultGodTiles;

    this.setState({
      playerCount,
      lastPlayerIndex,
      tiles: []
    });

    //hack to get highlighting working
    setTimeout(() => {
      this.setState({
        tiles: tilesToUse
      });
    });
  };

  addToShuffleHistory = newValue => {
    var newHistory = [...this.state.shuffleHistory, newValue];
    this.setState({
      shuffleHistory: newHistory
    });
  };

  setOrdering = newOrder => {
    this.setState({
      ordering: newOrder
    });
  };

  setHadesActive = () => {
    this.setState({
      hadesActive: true
    });
  };

  resetHades = () => {
    this.setState({
      hadesTotal: 0
    });
  };

  rollForHades = () => {
    var diceMax = diceValues.length;
    var dice1 = shuffle(diceValues)[Math.floor(Math.random() * diceMax)];
    var dice2 = shuffle(diceValues)[Math.floor(Math.random() * diceMax)];

    var total = this.state.hadesTotal + dice1 + dice2;
    this.setState({
      dice1,
      dice2,
      hadesTotal: total,
      hadesActive: false
    });

    return total;
  };

  setIsFavors = isFavors => {
    this.setState({
      isFavors
    });
  };

  setIsHades = isHades => {
    this.setState({
      isHades
    });
  };

  setIsTitans = isTitans => {
    var ordering = isTitans ? initialTitansOrdering : initialGodOrdering;

    var newHistory = [
      {
        cycle: 0,
        order: ordering,
        wasShuffled: true
      }
    ];

    this.setState({
      isTitans,
      tiles: isTitans ? defaultTitansTiles : defaultGodTiles,
      ordering,
      players,
      shuffleHistory: newHistory
    });
  };

  start = () => {
    this.setState({
      screenMode: 2,
      hadesTotal: 0,
      hadesActive: false,
    });
  };

  back = () => {
    this.setState({
      screenMode: 1
    });
  };

  options = () => {
    this.setState({
      screenMode: 3
    });
  };

  onChangeHades = e => {
    this.setIsHades(
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };

  onChangeFavors = e => {
    this.setIsFavors(
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };

  onChangeTitans = e => {
    this.setIsTitans(
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    );
  };

  setFavorTiles = favorTiles => {
    this.setState({
      favorTiles
    });
  };
  renderApp = () => {
    if (this.state.screenMode === 1) {
      return (
        <ul className="start">
          <li onClick={this.start}>Start</li>
          <li onClick={this.options} className="btnOpt">
            Options
          </li>
        </ul>
      );
    } else if (this.state.screenMode === 2) {
      return (
        <CardList
          ordering={this.state.ordering}
          setOrdering={this.setOrdering}
          addToHistory={this.addToShuffleHistory}
          incrementCycle={this.incrementCycleCount}
          rollForHades={this.rollForHades}
          setHadesActive={this.setHadesActive}
          resetHades={this.resetHades}
          back={this.back}
          lastPlayerIndex={this.state.lastPlayerIndex}
          cycleCount={this.state.cycleCount}
          tiles={this.state.tiles}
          isTitans={this.state.isTitans}
          isHades={this.state.isHades}
          isFavors={this.state.isFavors}
          shuffleHistory={this.state.shuffleHistory}
          playerCount={this.state.playerCount}
          hadesActive={this.state.hadesActive}
          setFavorTiles={this.setFavorTiles}
          favorTiles={this.state.favorTiles}
          defaultFavorTiles={defaultFavorTiles}
          dice1={this.state.dice1}
          dice2={this.state.dice2}
        />
      );
    } else if (this.state.screenMode === 3) {
      return (
        <div className="options">
          <div className={"active-text"} onClick={this.back}>
            back
          </div>
          <PlayerSelector
            isTitans={this.state.isTitans}
            players={this.state.players}
            playerCount={this.state.playerCount}
            setPlayerCount={this.setPlayerCount}
          />
          <div className={"checkbox-container"}>
            <Checkbox
              label="Titans"
              checked={this.state.isTitans}
              onChange={this.onChangeTitans}
            />
            <Checkbox
              label="Hades"
              checked={this.state.isHades}
              onChange={this.onChangeHades}
            />
            <Checkbox
              label="Favors"
              checked={this.state.isFavors}
              onChange={this.onChangeFavors}
            />
          </div>
        </div>
      );
    }
  };

  render() {
    return <div className="app-container">{this.renderApp()}</div>;
  }
}
