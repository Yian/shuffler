import React, { useState, useRef } from "react";
import { PlayerSelector } from "./PlayerSelector";
import { useGesture } from "react-use-gesture";
import clamp from "lodash.clamp";
import shuffle from "lodash.shuffle";
import slice from "lodash.slice";
import last from "lodash.last";
import remove from "lodash.remove";
import range from "lodash.range";
import swap from "lodash-move";
import { useSprings, animated, interpolate } from "react-spring";

const tileSpacing = 110;

const fn = (order, down, originalIndex, curIndex, y) => index =>
  down && index === originalIndex
    ? {
        y: curIndex * tileSpacing + y,
        scale: 1.1,
        zIndex: "1",
        shadow: 15,
        immediate: n => n === "y" || n === "zIndex",
        opacity: 1,
        backgroundColor: "red"
      }
    : {
        y: order.indexOf(index) * tileSpacing,
        scale: 1,
        zIndex: "0",
        shadow: 1,
        immediate: false,
        opacity: 1,
        backgroundColor: order.indexOf(index) >= 3 ? "blue" : "red"
      };

export const CardList = (props) => {
  var tiles;

  if (props.isTitans) {
    tiles = [
      { name: "A", no: 1 },
      { name: "P", no: 2 },
      { name: "Z", no: 3 },
      { name: "At", no: 4 },
      { name: "KR", no: 5 }
    ]
  } else {
    tiles = [
      { name: "A", no: 1 },
      { name: "P", no: 2 },
      { name: "Z", no: 3 },
      { name: "At", no: 4 },
    ]
  }

  var ordering = range(tiles.length); //inital ordering;
  const [playerCount, setPlayerCount] = useState(2);
  const [cycleCount, setCycleCount] = useState(1);

  const [shuffleHistory, setShuffleHistory] = useState([
    {
      cycle: cycleCount,
      order: ordering,
      wasShuffled: true
    }
  ]);

  const order = useRef(ordering.map(item => item)); // Store indicies as a local ref, this represents the item order
  const [springs, setSprings] = useSprings(tiles.length, fn(order.current)); // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex);
    const curRow = clamp(
      Math.round((curIndex * tileSpacing + y) / tileSpacing),
      0,
      tiles.length - 1
    );
    const newOrder = swap(order.current, curIndex, curRow);
    setSprings(fn(newOrder, down, originalIndex, curIndex, y)); // Feed springs new style data, they'll animate the view without causing a single render
    if (!down) order.current = newOrder;
  });

  const shuffleTiles = () => {
    setCycleCount(cycleCount + 1);
    var newOrder;
    var wasShuffled;
    var lastRoll = shuffleHistory[shuffleHistory.length - 1];
    var lastRollOrder = lastRoll.order;

    if (playerCount === 5) {
      newOrder = shuffle(order.current);
    }

    if (playerCount === 4 || playerCount === 2) {
      var lastGod = last(lastRollOrder);
      newOrder = shuffle(slice(order.current, 0, 3));
      newOrder.unshift(lastGod);
    }

    if (playerCount === 3) {
      //Last 2 gods go first
      if (lastRoll.wasShuffled) {
        var lastTwoGods = slice(lastRollOrder, 2, 4);
        var firstTwoGods = slice(lastRollOrder, 0, 2);
        newOrder = lastTwoGods.concat(firstTwoGods);
        wasShuffled = false;
      } else {
        //Next turn: Shuffle all 4
        newOrder = shuffle(order.current);
        wasShuffled = true;
      }
    }

    setShuffleHistory([
      ...shuffleHistory,
      {
        cycle: cycleCount,
        order: newOrder,
        wasShuffled: wasShuffled
      }
    ]);

    order.current = newOrder;
    animateTiles(newOrder);
  };

  const animateTiles = newOrder => {
    setSprings({
      y: 125,
      backgroundColor: "green"
    });

    setTimeout(() => {
      setSprings(fn(newOrder));
    }, 500);
  };

  return (
    <div>
      <PlayerSelector
        playerCount={playerCount}
        setPlayerCount={setPlayerCount}
      />
      <div className="button" onClick={shuffleTiles}>
        Click
      </div>
      <div className={"card-list"} style={{ height: tiles.length * 100 }}>
        {springs.map(
          ({ zIndex, shadow, y, scale, opacity, backgroundColor }, i) => (
            <animated.div
              {...bind(i)}
              key={i}
              style={{
                backgroundColor,
                zIndex,
                opacity,
                boxShadow: shadow.interpolate(
                  s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                ),
                transform: interpolate(
                  [y, scale],
                  (y, s) => `translate3d(0,${y}px,0) scale(${s})`
                )
              }}
              children={tiles[i].no}
            />
          )
        )}
      </div>
    </div>
  );
};
