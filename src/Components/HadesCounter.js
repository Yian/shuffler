import React from "react";
import { animated } from "react-spring";

export class HadesCounter extends React.Component {
  refThreatSize = element => {
    if (element) {
      this.props.getThreatWidth({width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height});
    }
  };

  refNumberWdithSize = element => {
    if (element) {
      this.props.getNumberWidth(element.getBoundingClientRect().width);
    }
  };

  render() {
    return (
      <div className={"hadesContainer"} ref={this.refThreatSize}>
      <div className="dice-container">
        <div className="dice-face">{this.props.dice1}</div>
        <div className="dice-face">{this.props.dice2}</div>
      </div>
        <div className="hadesCounterContainer">
          <animated.div
            className={"hadesCounter"}
            style={this.props.hadesCounter}
          />
          <ul className="numbers">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(no => (
              <li ref={this.refNumberWdithSize}>{no}</li>
            ))}
          </ul>
        </div>
        <animated.img
          className={"hades"}
          draggable="false"
          src={process.env.PUBLIC_URL + "/hades.jpg"}
          style={this.props.hades}
        />
      </div>
    );
  }
}
