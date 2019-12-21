import React from "react";
import { CardList } from "./CardList";
import { Checkbox } from "./Checkbox";
import { PlayerSelector } from "./PlayerSelector";
import shuffle from "lodash.shuffle";

const initialGodOrdering = [0, 1, 2, 3];
const players = [3, 4, 5, 6];
const initialTitansOrdering = [0, 1, 2, 3, 4];
const diceValues = [0, 1, 1, 2, 2, 3];

const defaultFavorTiles = shuffle([
  { name: "aphrodite", used: false },
  { name: "artemis", used: false },
  { name: "demeter", used: false },
  { name: "dionysos", used: false },
  { name: "hephaistos", used: false },
  { name: "hermes", used: false },
  { name: "hera", used: false },
  { name: "hestia", used: false },
]);

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
      isHecate: false,
      hadesActive: false,
      hadesTotal: 0,
      lastPlayerIndex: 4,
      favorTiles: shuffle(defaultFavorTiles),
      defaultFavorTiles,
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

  componentDidMount() {
    defaultGodTiles.forEach((picture) => {
        const img = new Image();
        img.src = process.env.PUBLIC_URL + "/" + picture + ".png";
    });

    const img = new Image();
    img.src = process.env.PUBLIC_URL + "/" + "blank.png";
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

  setHades = (total) => {
    this.setState({
      hadesTotal: total
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

  setIsHecate = isHecate => {
    var favorTiles = defaultFavorTiles;

    if (isHecate) {
      favorTiles = [...defaultFavorTiles, { name: "hecate", used: false }]
    }

    this.setState({
      defaultFavorTiles: favorTiles,
      favorTiles: shuffle(favorTiles),
      isHecate,
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
      cycleCount: 0,
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

  onChangeHecate = e => {
    this.setIsHecate(
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
          <div className="img" />
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
          setHades={this.setHades}
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
          defaultFavorTiles={this.state.defaultFavorTiles}
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
            <Checkbox
              label="Hecate"
              checked={this.state.isHecate}
              onChange={this.onChangeHecate}
              className={!this.state.isFavors && "disabled"}
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
