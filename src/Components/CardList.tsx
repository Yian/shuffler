import { useState, useCallback, useEffect, useRef } from "react";
import { useSprings, useSpring, animated, to, type SpringValues } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import clamp from "lodash/clamp";
import shuffle from "lodash/shuffle";
import findLastIndex from "lodash/findLastIndex";
import { HadesCounter } from "./HadesCounter";
import type { GodTile, FavorTile, ShuffleHistoryEntry } from "./AppContainer";
import { computeNewOrder } from "../utils/shuffleLogic";

// ── Helpers ───────────────────────────────────────────────────────────────────

function arrayMove<T>(arr: T[], fromIdx: number, toIdx: number): T[] {
  const result = [...arr];
  const [item] = result.splice(fromIdx, 1);
  result.splice(toIdx, 0, item);
  return result;
}

const IMAGE_RATIO = 3.8744588744588744;
const BASE = import.meta.env.BASE_URL;

// Springs only track numeric layout values. src is computed in render.
interface TileSpring {
  y: number;
  scale: number;
  zIndex: number;
  shadow: number;
  z: number;
}

/** Config for a tile sitting at its ordered position (not dragging, not animating). */
function restConfig(posInOrder: number, spacing: number, heightCalculated: boolean): TileSpring {
  return {
    y: heightCalculated ? posInOrder * spacing : 0,
    scale: 1,
    zIndex: 0,
    shadow: 1,
    z: 0,
  };
}

function buildFavorSprings(tiles: FavorTile[]) {
  return (index: number) => ({
    opacity: tiles[index].used ? 0 : 1,
    y: 0,
    x: tiles[index].used ? 100 : 0,
  });
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface CardListProps {
  ordering: number[];
  setOrdering: (order: number[]) => void;
  addToHistory: (entry: ShuffleHistoryEntry) => void;
  incrementCycle: () => void;
  rollForHades: () => number;
  setHadesActive: () => void;
  resetHades: () => void;
  setHades: (total: number) => void;
  back: () => void;
  lastPlayerIndex: number;
  cycleCount: number;
  tiles: GodTile[];
  isTitans: boolean;
  isHades: boolean;
  isFavors: boolean;
  shuffleHistory: ShuffleHistoryEntry[];
  playerCount: number;
  hadesActive: boolean;
  setFavorTiles: (tiles: FavorTile[]) => void;
  favorTiles: FavorTile[];
  defaultFavorTiles: FavorTile[];
  dice1: number;
  dice2: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CardList(props: CardListProps) {
  const { tiles, ordering, lastPlayerIndex, favorTiles, playerCount } = props;

  const spacingRef = useRef(0);
  const [heightCalculated, setHeightCalculated] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [rollDisabled, setRollDisabled] = useState(false);
  const [round, setRound] = useState(0);

  const threatSizeRef = useRef({ width: 0, height: 0 });
  const threatNumberWidthRef = useRef(0);

  // ── Springs ───────────────────────────────────────────────────────────────

  const [tileSprings, tileApi] = useSprings<TileSpring>(tiles.length, () => ({
    y: 0,
    scale: 1,
    zIndex: 0,
    shadow: 1,
    z: 0,
  }));

  const [favorSprings, favorApi] = useSprings(
    favorTiles.length,
    buildFavorSprings(favorTiles)
  );

  const [hadesStyle, hadesApi] = useSpring(() => ({
    opacity: 0,
    transform: `translate3d(0px, -200px, 0)`,
  }));

  const [hadesCounterStyle, hadesCounterApi] = useSpring(() => ({
    transform: `translate3d(0px, 0px, 0)`,
  }));

  // ── Position tiles according to an ordering ───────────────────────────────

  const positionTiles = useCallback(
    (order: number[]) => {
      tileApi.start((i) => restConfig(order.indexOf(i), spacingRef.current, heightCalculated));
    },
    [tileApi, heightCalculated]
  );

  // ── Tile height measurement ───────────────────────────────────────────────

  const measureTile = useCallback(
    (element: HTMLImageElement | null) => {
      if (!element) return;
      const height = element.getBoundingClientRect().width / IMAGE_RATIO;
      if (spacingRef.current > 0) {
        spacingRef.current = Math.min(height, spacingRef.current);
      } else {
        spacingRef.current = height;
      }
      if (!heightCalculated) setHeightCalculated(true);
    },
    [heightCalculated]
  );

  // Once height is known, lay the tiles out in the current ordering
  useEffect(() => {
    if (round === 0 && heightCalculated) {
      positionTiles(ordering);
    }
  }, [heightCalculated, ordering, positionTiles, round]);

  // ── Drag ──────────────────────────────────────────────────────────────────

  const bind = useDrag(({ args: [originalIndex], down, movement: [, my] }) => {
    if (round > 0) return;

    const origIdx = originalIndex as number;
    const curIdx = ordering.indexOf(origIdx);
    const curRow = clamp(
      Math.round((curIdx * spacingRef.current + my) / spacingRef.current),
      0,
      tiles.length - 1
    );
    const newOrder = arrayMove(ordering, curIdx, curRow);

    tileApi.start((i) => {
      if (down && i === origIdx) {
        // The tile being dragged: follow the pointer, lift up
        return {
          y: curIdx * spacingRef.current + my,
          scale: 1.1,
          zIndex: 1,
          shadow: 15,
          z: 0,
          immediate: (key: string) => key === "y" || key === "zIndex",
        };
      }
      // All other tiles: snap to their new position in the preview order
      return { ...restConfig(newOrder.indexOf(i), spacingRef.current, heightCalculated), immediate: false };
    });

    if (!down) {
      props.setOrdering(newOrder);
      props.addToHistory({ cycle: props.cycleCount, order: newOrder, wasShuffled: true });
    }
  });

  // ── Hades roll ────────────────────────────────────────────────────────────

  const rollHades = useCallback(
    (overrideTotal?: number) => {
      const hadesRoll = overrideTotal ?? props.rollForHades();

      if (hadesRoll === 0) {
        hadesCounterApi.start({ transform: `translate3d(0px, 0px, 0px)` });
        return;
      }

      const offset =
        (hadesRoll * threatSizeRef.current.width) / 9 - threatNumberWidthRef.current;
      hadesCounterApi.start({ transform: `translate3d(${offset}px, 0px, 0px)` });

      if (hadesRoll >= 9) {
        setTimeout(() => {
          hadesApi.start({
            opacity: 1,
            transform: `translate3d(0px, ${
              spacingRef.current * (playerCount - 2) +
              threatSizeRef.current.height +
              10
            }px, 0px)`,
          });
        }, 400);
        hadesCounterApi.start({ transform: `translate3d(0px, 0px, 0px)` });
        props.resetHades();
        props.setHadesActive();
      } else {
        hadesApi.start({
          opacity: 0,
          transform: `translate3d(0px, -${spacingRef.current}px, 0px)`,
        });
      }
    },
    [hadesApi, hadesCounterApi, playerCount, props]
  );

  // ── Favor tiles ───────────────────────────────────────────────────────────

  const resetFavors = useCallback(() => {
    const shuffled = shuffle(props.defaultFavorTiles);
    props.setFavorTiles(shuffled);
    favorApi.start(buildFavorSprings(shuffled));
  }, [favorApi, props]);

  const cycleFavors = useCallback(() => {
    const lastUnusedIdx = findLastIndex(favorTiles, (t) => !t.used);
    const updated = favorTiles.map((t, i) =>
      i === lastUnusedIdx ? { ...t, used: true } : t
    );
    props.setFavorTiles(updated);
    favorApi.start(buildFavorSprings(updated));
    if (lastUnusedIdx === 0 || props.hadesActive) resetFavors();
  }, [favorApi, favorTiles, props, resetFavors]);

  // ── Shuffle logic ─────────────────────────────────────────────────────────

  const shuffleTiles = useCallback(() => {
    setRound((r) => r + 1);
    setRollDisabled(true);
    setTimeout(() => setRollDisabled(false), 500);
    props.incrementCycle();

    if (props.isFavors && props.cycleCount > 0) cycleFavors();

    const { order: newOrder, wasShuffled } = computeNewOrder(
      ordering,
      props.shuffleHistory,
      props.isTitans,
      playerCount,
      tiles.length
    );
    props.addToHistory({ cycle: props.cycleCount, order: newOrder, wasShuffled });
    props.setOrdering(newOrder);

    // Phase 1: all tiles fly up with a random tilt (using function form, safe for useSprings)
    setIsShuffling(true);
    tileApi.start((_i) => ({
      y: 125,
      scale: 1,
      shadow: 1,
      z: Math.floor(Math.random() * 11) - 5,
      immediate: false,
    }));

    if (props.isHades) rollHades();

    // Phase 2: land in the new positions, no tilt
    setTimeout(() => {
      setIsShuffling(false);
      tileApi.start((i) => ({
        ...restConfig(newOrder.indexOf(i), spacingRef.current, heightCalculated),
        z: 0,
      }));
    }, 500);
  }, [
    props,
    cycleFavors,
    computeNewOrder,
    ordering,
    tileApi,
    rollHades,
    heightCalculated,
  ]);

  // ── Render ────────────────────────────────────────────────────────────────

  const blankSrc = `${BASE}blank.png`;

  return (
    <div className={`cardlist-container${!props.isHades ? " add-margin" : ""}`}>
      <div className="top-container">
        <div className="active-text" onClick={props.back}>
          Back
        </div>
        <div
          className={`active-text${rollDisabled ? " disabled" : ""}`}
          onClick={shuffleTiles}
        >
          Cycle: {props.cycleCount}
        </div>
      </div>

      {props.isHades && (
        <HadesCounter
          dice1={props.dice1}
          dice2={props.dice2}
          getThreatWidth={(size) => { threatSizeRef.current = size; }}
          getNumberWidth={(w) => { threatNumberWidthRef.current = w; }}
          hades={hadesStyle as SpringValues<{ opacity: number; transform: string }>}
          hadesCounter={hadesCounterStyle as SpringValues<{ transform: string }>}
          hadesNumberClicked={(no) => { props.setHades(no); rollHades(no); }}
        />
      )}

      <div
        className="card-list"
        style={{ height: tiles.length * spacingRef.current }}
      >
        {tileSprings.map(({ zIndex, shadow, y, z, scale }, i) => {
          // src is plain React state — not a spring value
          const posInOrder = ordering.indexOf(i);
          const isBlank = isShuffling || posInOrder >= lastPlayerIndex;
          const src = isBlank ? blankSrc : `${BASE}${tiles[i]?.name}.png`;

          return (
            <animated.img
              {...bind(i)}
              ref={measureTile}
              draggable={false}
              key={i}
              src={src}
              alt={tiles[i]?.name ?? ""}
              style={{
                zIndex,
                boxShadow: shadow.to(
                  (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                ),
                transform: to(
                  [y, scale, z],
                  (y, s, z) =>
                    `rotateZ(${z}deg) translate3d(0px, ${y}px, 0) scale(${s})`
                ),
              }}
            />
          );
        })}
      </div>

      <div className="favor-container">
        {props.isFavors &&
          !props.hadesActive &&
          props.cycleCount > 0 &&
          favorSprings.map(({ opacity, x, y }, i) => (
            <animated.img
              key={i}
              className="favors"
              draggable={false}
              src={`${BASE}${favorTiles[i]?.name}.jpg`}
              alt={favorTiles[i]?.name ?? ""}
              style={{
                opacity,
                transform: to([x, y], (x, y) => `translate3d(${x}px, ${y}px, 0)`),
              }}
            />
          ))}
      </div>
    </div>
  );
}
