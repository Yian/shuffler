import { useState, useCallback } from "react";
import shuffle from "lodash/shuffle";
import { CardList } from "./CardList";
import { Checkbox } from "./Checkbox";
import { PlayerSelector } from "./PlayerSelector";

// ── Types ────────────────────────────────────────────────────────────────────

export interface GodTile {
  name: string;
}

export interface FavorTile {
  name: string;
  used: boolean;
}

export interface ShuffleHistoryEntry {
  cycle: number;
  order: number[];
  wasShuffled: boolean;
}

// ── Constants ────────────────────────────────────────────────────────────────

const INITIAL_GOD_ORDERING = [0, 1, 2, 3];
const INITIAL_TITANS_ORDERING = [0, 1, 2, 3, 4];
const PLAYER_OPTIONS = [3, 4, 5, 6];
const DICE_VALUES = [0, 1, 1, 2, 2, 3];

const DEFAULT_FAVOR_TILES: FavorTile[] = [
  { name: "aphrodite", used: false },
  { name: "artemis", used: false },
  { name: "demeter", used: false },
  { name: "dionysos", used: false },
  { name: "hephaistos", used: false },
  { name: "hermes", used: false },
  { name: "hera", used: false },
  { name: "hestia", used: false },
];

const DEFAULT_GOD_TILES: GodTile[] = [
  { name: "ares" },
  { name: "athena" },
  { name: "zeus" },
  { name: "poseidon" },
];

const DEFAULT_TITANS_TILES: GodTile[] = [
  { name: "ares" },
  { name: "athena" },
  { name: "zeus" },
  { name: "poseidon" },
  { name: "kronos" },
];

type ScreenMode = "start" | "game" | "options";

// ── Component ────────────────────────────────────────────────────────────────

export function AppContainer() {
  const [screenMode, setScreenMode] = useState<ScreenMode>("start");
  const [playerCount, setPlayerCountState] = useState(5);
  const [cycleCount, setCycleCount] = useState(0);
  const [isTitans, setIsTitansState] = useState(false);
  const [isHades, setIsHades] = useState(false);
  const [isFavors, setIsFavors] = useState(false);
  const [isHecate, setIsHecateState] = useState(false);
  const [hadesActive, setHadesActiveState] = useState(false);
  const [hadesTotal, setHadesTotal] = useState(0);
  const [favorTiles, setFavorTiles] = useState<FavorTile[]>(() =>
    shuffle(DEFAULT_FAVOR_TILES)
  );
  const [activeFavorTiles, setActiveFavorTiles] =
    useState<FavorTile[]>(DEFAULT_FAVOR_TILES);
  const [tiles, setTiles] = useState<GodTile[]>(DEFAULT_GOD_TILES);
  const [ordering, setOrdering] = useState<number[]>(INITIAL_GOD_ORDERING);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [shuffleHistory, setShuffleHistory] = useState<ShuffleHistoryEntry[]>([
    { cycle: 0, order: INITIAL_GOD_ORDERING, wasShuffled: true },
  ]);

  const lastPlayerIndex = playerCount - 1;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const incrementCycleCount = useCallback(() => {
    setCycleCount((c) => c + 1);
  }, []);

  const setPlayerCount = useCallback(
    (count: number) => {
      const tilesToUse = isTitans ? DEFAULT_TITANS_TILES : DEFAULT_GOD_TILES;
      setPlayerCountState(count);
      // Brief reset to force highlight re-render
      setTiles([]);
      setTimeout(() => setTiles(tilesToUse), 0);
    },
    [isTitans]
  );

  const addToShuffleHistory = useCallback((entry: ShuffleHistoryEntry) => {
    setShuffleHistory((prev) => [...prev, entry]);
  }, []);

  const setHadesActive = useCallback(() => setHadesActiveState(true), []);

  const resetHades = useCallback(() => setHadesTotal(0), []);

  const setHades = useCallback((total: number) => setHadesTotal(total), []);

  const rollForHades = useCallback(() => {
    const pick = () =>
      shuffle(DICE_VALUES)[
        Math.floor(Math.random() * DICE_VALUES.length)
      ];
    const d1 = pick();
    const d2 = pick();
    setDice1(d1);
    setDice2(d2);
    const total = hadesTotal + d1 + d2;
    setHadesTotal(total);
    setHadesActiveState(false);
    return total;
  }, [hadesTotal]);

  const setIsTitans = useCallback((value: boolean) => {
    const ordering = value ? INITIAL_TITANS_ORDERING : INITIAL_GOD_ORDERING;
    setIsTitansState(value);
    setTiles(value ? DEFAULT_TITANS_TILES : DEFAULT_GOD_TILES);
    setOrdering(ordering);
    setShuffleHistory([{ cycle: 0, order: ordering, wasShuffled: true }]);
  }, []);

  const setIsHecate = useCallback((value: boolean) => {
    const base = value
      ? [...DEFAULT_FAVOR_TILES, { name: "hecate", used: false }]
      : DEFAULT_FAVOR_TILES;
    setIsHecateState(value);
    setActiveFavorTiles(base);
    setFavorTiles(shuffle(base));
  }, []);

  const start = useCallback(() => {
    setScreenMode("game");
    setHadesTotal(0);
    setHadesActiveState(false);
    setCycleCount(0);
  }, []);

  const back = useCallback(() => setScreenMode("start"), []);
  const options = useCallback(() => setScreenMode("options"), []);

  // ── Render ────────────────────────────────────────────────────────────────

  if (screenMode === "start") {
    return (
      <ul className="start">
        <div className="img" />
        <li onClick={start}>Start</li>
        <li onClick={options} className="btnOpt">
          Options
        </li>
      </ul>
    );
  }

  if (screenMode === "game") {
    return (
      <CardList
        ordering={ordering}
        setOrdering={setOrdering}
        addToHistory={addToShuffleHistory}
        incrementCycle={incrementCycleCount}
        rollForHades={rollForHades}
        setHadesActive={setHadesActive}
        resetHades={resetHades}
        setHades={setHades}
        back={back}
        lastPlayerIndex={lastPlayerIndex}
        cycleCount={cycleCount}
        tiles={tiles}
        isTitans={isTitans}
        isHades={isHades}
        isFavors={isFavors}
        shuffleHistory={shuffleHistory}
        playerCount={playerCount}
        hadesActive={hadesActive}
        setFavorTiles={setFavorTiles}
        favorTiles={favorTiles}
        defaultFavorTiles={activeFavorTiles}
        dice1={dice1}
        dice2={dice2}
      />
    );
  }

  // screenMode === "options"
  return (
    <div className="options">
      <div className="active-text" onClick={back}>
        back
      </div>
      <PlayerSelector
        isTitans={isTitans}
        players={PLAYER_OPTIONS}
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
      />
      <div className="checkbox-container">
        <Checkbox
          label="Titans"
          checked={isTitans}
          onChange={(e) => setIsTitans(e.target.checked)}
        />
        <Checkbox
          label="Hades"
          checked={isHades}
          onChange={(e) => setIsHades(e.target.checked)}
        />
        <Checkbox
          label="Favors"
          checked={isFavors}
          onChange={(e) => setIsFavors(e.target.checked)}
        />
        <Checkbox
          label="Hecate"
          checked={isHecate}
          onChange={(e) => setIsHecate(e.target.checked)}
          disabled={!isFavors}
        />
      </div>
    </div>
  );
}
