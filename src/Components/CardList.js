import React, { useCallback, useEffect, useState } from "react";
import { useGesture } from "react-use-gesture";
import { HadesCounter } from "./HadesCounter";
import clamp from "lodash.clamp";
import shuffle from "lodash.shuffle";
import slice from "lodash.slice";
import last from "lodash.last";
import swap from "lodash-move";
import { useSpring, useSprings, animated, interpolate } from "react-spring";
import findLastIndex from "lodash.findlastindex";

let tileSpacing = 0;
const ratio = 3.8744588744588744588744588744589;

const fn = (
  order,
  tiles,
  lastPlayerIndex,
  heightCalculated,
  down,
  originalIndex,
  curIndex,
  y
) => index => {
  var result = {};
  var randomZ = Math.floor(Math.random() * 11) - 5;
  const tile = tiles[index];
  const imageUrl = process.env.PUBLIC_URL + "/" + tile.name + ".png";
  const blankImageUrl = process.env.PUBLIC_URL + "/" + "blank.png";

  down && index === originalIndex
    ? (result = {
        y: tile.shuffling ? 125 : curIndex * tileSpacing + y,
        scale: tile.shuffling ? 1 : 1.1,
        zIndex: "1",
        shadow: 15,
        immediate: n => n === "y" || n === "zIndex"
      })
    : (result = {
        y: tile.shuffling
          ? 125
          : heightCalculated
          ? order.indexOf(index) * tileSpacing
          : 0,
        scale: 1,
        zIndex: "0",
        shadow: 1,
        immediate: false,
        src:
          order.indexOf(index) >= lastPlayerIndex || tile.shuffling
            ? blankImageUrl
            : imageUrl
      });

  return { ...{ opacity: 1, z: tile.shuffling ? randomZ : 0 }, ...result };
};

const fn2 = favorTiles => index => {
  return {
    opacity: favorTiles[index].used ? 0 : 1,
    x: favorTiles[index].used ? 100 : 0,
    name: favorTiles[index].name
  };
};

export const CardList = props => {
  const tiles = props.tiles;
  let favorTiles = props.favorTiles;
  const ordering = props.ordering; //inital ordering;
  const lastPlayerIndex = props.lastPlayerIndex;
  const [threatSize, setThreatSize] = useState(0);
  const [threatNumberWidth, setThreatNumberWidth] = useState(0);
  const [rollDisabled, setRollDisabled] = useState(false);
  const [round, setRound] = useState(0);
  const [heightCalculated, setHeightCalculated] = useState(false);

  const [hades, setHades] = useSpring(() => ({
    transform: `translate3d(0px, -${tileSpacing}px, 0)`
  }));

  const [hadesCounter, setHadesCounter] = useSpring(() => ({
    transform: `translate3d(0px,0px,0)`
  }));

  const [tileSprings, setSprings] = useSprings(
    tiles.length,
    fn(ordering, tiles, lastPlayerIndex, heightCalculated)
  ); // Create springs, each corresponds to an item, controlling its transform, scale, etc.

  const [favorSprings, setFavors] = useSprings(
    favorTiles.length,
    fn2(favorTiles)
  );

  const getTileHeight = element => {
    if (element) {
      var height = element.getBoundingClientRect().width / ratio;

      if (tileSpacing > 0) {
        tileSpacing = Math.min(height, tileSpacing);
      } else {
        tileSpacing = height;
      }

      if (!heightCalculated) {
        setHeightCalculated(true);
      }
    }
  };

  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    if (round <= 0) {
      const curIndex = ordering.indexOf(originalIndex);
      const curRow = clamp(
        Math.round((curIndex * tileSpacing + y) / tileSpacing),
        0,
        tiles.length - 1
      );
      const newOrder = swap(ordering, curIndex, curRow);
      setSprings(
        fn(
          newOrder,
          tiles,
          lastPlayerIndex,
          heightCalculated,
          down,
          originalIndex,
          curIndex,
          y,
          props.playerCount
        )
      ); // Feed springs new style data, they'll animate the view without causing a single render
      if (!down) {
        props.setOrdering(newOrder);
        props.addToHistory({
          cycle: props.cycleCount,
          order: newOrder,
          wasShuffled: true
        });
      }
    }
  });

  const rollHades = () => {
    var hadesRoll = props.rollForHades();
    setHadesCounter({
      transform: `translate3d(${
        hadesRoll === 0
          ? hadesRoll
          : (hadesRoll * threatSize.width) / 9 - threatNumberWidth
      }px,0px,0px)`
    });

    if (hadesRoll > 9) {
      setTimeout(() => {
        setHades({
          opacity: 1,
          transform: `translate3d(0px, ${tileSpacing * (props.playerCount - 2) +
            threatSize.height +
            10}px,0px)`
        });
      }, 400);
      setHadesCounter({ transform: `translate3d(0px,0px,0px)` });
      props.resetHades();
      props.setHadesActive();
    } else {
      setHades({
        opacity: 0,
        transform: `translate3d(0px,-${tileSpacing}px,0px)`,
        zIndex: "999"
      });
    }
  };

  const resetFavors = () => {
    var shuffedFavorTiles = shuffle(props.defaultFavorTiles);
    props.setFavorTiles(shuffedFavorTiles);
    setFavors(fn2(shuffedFavorTiles));
  };

  const cycleFavors = () => {
    const lastUnusedIndex = findLastIndex(favorTiles, searchFavorTile => {
      return searchFavorTile.used === false;
    });

    let updatedTiles = favorTiles.map((favorTile, index) => {
      return index === lastUnusedIndex
        ? Object.assign({}, favorTile, { used: true })
        : favorTile;
    });

    props.setFavorTiles(updatedTiles);
    setFavors(fn2(updatedTiles));

    if (lastUnusedIndex === 0 || props.hadesActive) {
      resetFavors();
    }
  };

  const normalShuffle = ordering => {
    return shuffle(ordering);
  };

  const shuffleLastFirst = (ordering, lastRollOrder) => {
    var lastGod = last(lastRollOrder);
    var newOrder = shuffle(slice(ordering, 0, props.tiles.length - 1));
    newOrder.unshift(lastGod);
    return newOrder;
  };

  const shuffleTiles = () => {
    setRound(round + 1);
    setRollDisabled(true);
    setTimeout(() => {
      setRollDisabled(false);
    }, 500);

    props.incrementCycle();

    if (props.isFavors) {
      cycleFavors();
    }

    let newOrder;
    let wasShuffled;
    let lastRoll = last(props.shuffleHistory);
    let lastRollOrder = lastRoll.order;

    if (!props.isTitans) {
      if (props.playerCount === 5) {
        newOrder = normalShuffle(ordering);
      }

      if (props.playerCount === 4 || props.playerCount === 2) {
        newOrder = shuffleLastFirst(ordering, lastRollOrder);
      }

      if (props.playerCount === 3) {
        //Last 2 gods go first
        if (lastRoll.wasShuffled) {
          let lastTwoGods = slice(lastRollOrder, 2, 4);
          let firstTwoGods = slice(lastRollOrder, 0, 2);
          newOrder = lastTwoGods.concat(firstTwoGods);
          wasShuffled = false;
        } else {
          //Next turn: Shuffle all
          newOrder = shuffle(ordering);
          wasShuffled = true;
        }
      }
    }

    if (props.isTitans) {
      if (props.playerCount === 6) {
        newOrder = normalShuffle(ordering);
      }
      if (props.playerCount === 5) {
        newOrder = shuffleLastFirst(ordering, lastRollOrder);
      }
      if (props.playerCount === 4) {
        //Last 2 gods go first
        if (lastRoll.wasShuffled) {
          var lastTwoTitansGods = slice(lastRollOrder, 3, 5);
          var firstThreeGods = shuffle(slice(lastRollOrder, 0, 3));
          newOrder = lastTwoTitansGods.concat(firstThreeGods);
          wasShuffled = false;
        } else {
          //Next turn: Shuffle all
          newOrder = shuffle(ordering);
          wasShuffled = true;
        }
      }
      if (props.playerCount === 3) {
        //Last 3 gods shuffled random and first two placed
        var lastThreeGodsShuffled = shuffle(slice(lastRollOrder, 2, 5));
        var TwoFromThree = slice(lastThreeGodsShuffled, 0, 2);

        var firstTwoGodsFromLastRoll = slice(lastRollOrder, 0, 2);
        var missedOutGod = last(lastThreeGodsShuffled);
        newOrder = TwoFromThree.concat(firstTwoGodsFromLastRoll).concat(
          missedOutGod
        );
      }
    }

    props.addToHistory({
      cycle: props.cycleCount,
      order: newOrder,
      wasShuffled: wasShuffled
    });

    props.setOrdering(newOrder);
    animateTiles(newOrder, props.playerCount);
  };

  const animateTiles = useCallback(newOrder => {
    tiles.forEach(tile => {
      tile.shuffling = true;
    });

    setSprings(fn(newOrder, tiles, lastPlayerIndex, heightCalculated));

    if (props.isHades) {
      rollHades();
    }

    setTimeout(() => {
      tiles.forEach(tile => {
        tile.shuffling = false;
      });
      setSprings(fn(newOrder, tiles, lastPlayerIndex, heightCalculated));
    }, 500);
  });

  useEffect(() => {
    if (round === 0 && heightCalculated) {
      setSprings(fn(props.ordering, tiles, lastPlayerIndex, heightCalculated));
    }
  }, [
    heightCalculated,
    lastPlayerIndex,
    props.ordering,
    round,
    setSprings,
    tiles
  ]);

  return (
    <div className={`cardlist-container ${props.isHades == false ? "add-margin" : ""}` }>
      <div className={"top-container"}>
        <div className={"active-text"} onClick={props.back}>
          Back
        </div>
        <div
          className={`active-text ${rollDisabled ? "disabled" : ""}`}
          onClick={shuffleTiles}
        >
          Cycle: {props.cycleCount}
        </div>
      </div>
      {props.isHades && (
        <HadesCounter
          dice1={props.dice1}
          dice2={props.dice2}
          getThreatWidth={size => setThreatSize(size)}
          getNumberWidth={size => setThreatNumberWidth(size)}
          hades={hades}
          hadesCounter={hadesCounter}
        />
      )}
      <div
        className={"card-list"}
        style={{ height: tiles.length * tileSpacing }}
      >
        {tileSprings.map(
          (
            { zIndex, shadow, y, z, scale, opacity, backgroundColor, src },
            i
          ) => (
            <animated.img
              {...bind(i)}
              ref={getTileHeight}
              draggable="false"
              key={i}
              src={src}
              style={{
                backgroundColor,
                zIndex,
                opacity,
                boxShadow: shadow.interpolate(
                  s => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
                ),
                transform: interpolate(
                  [y, scale, z],
                  (y, s, z) =>
                    `rotateZ(${z}deg) translate3d(0px,${y}px,0) scale(${s})`
                )
              }}
            />
          )
        )}
      </div>
      <div className="favor-container">
        {props.isFavors && !props.hadesActive &&
          favorSprings.map(props => (
            <animated.img
              className={"favors"}
              draggable="false"
              src={`${process.env.PUBLIC_URL}/${props.name.value}.jpg`}
              style={{
                opacity: props.opacity,
                transform: interpolate(
                  [props.x],
                  x=> `translate3d(${x}px,0px,0)`
                )
              }}
            />
          ))}
      </div>
    </div>
  );
};
