import { useRef, useEffect } from "react";
import { animated, type SpringValues } from "@react-spring/web";

interface HadesCounterProps {
  dice1: number;
  dice2: number;
  getThreatWidth: (size: { width: number; height: number }) => void;
  getNumberWidth: (width: number) => void;
  hades: SpringValues<{ opacity: number; transform: string }>;
  hadesCounter: SpringValues<{ transform: string }>;
  hadesNumberClicked: (no: number) => void;
}

const HADES_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export function HadesCounter({
  dice1,
  dice2,
  getThreatWidth,
  getNumberWidth,
  hades,
  hadesCounter,
  hadesNumberClicked,
}: HadesCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      getThreatWidth({ width: rect.width, height: rect.height });
    }
  }, [getThreatWidth]);

  useEffect(() => {
    if (numberRef.current) {
      getNumberWidth(numberRef.current.getBoundingClientRect().width);
    }
  }, [getNumberWidth]);

  return (
    <div className="hadesContainer" ref={containerRef}>
      <div className="dice-container">
        <div className="dice-face">{dice1}</div>
        <div className="dice-face">{dice2}</div>
      </div>
      <div className="hadesCounterContainer">
        <animated.div className="hadesCounter" style={hadesCounter} />
        <ul className="numbers">
          {HADES_NUMBERS.map((no) => (
            <li
              key={no}
              ref={no === 0 ? numberRef : undefined}
              onClick={() => hadesNumberClicked(no)}
            >
              {no}
            </li>
          ))}
        </ul>
      </div>
      <animated.img
        className="hades"
        draggable={false}
        src={`${import.meta.env.BASE_URL}hades.jpg`}
        style={hades}
        alt="Hades"
      />
    </div>
  );
}
