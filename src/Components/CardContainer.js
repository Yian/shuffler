import React from "react";
import { CardList } from "./CardList";

//const CardContainerContext = React.createContext();

export class CardContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isTitans: false
    };
  }

  setIsTitans = (isTitans) => {
    this.setState({
      isTitans: true
    });
  };

  render() {
    return (
      <div>
        <label>
          Is going:
          <input
            name="isTitans"
            type="checkbox"
            checked={this.state.isTitans}
            onChange={(e, val) => {
              this.setIsTitans(val);
            }}
          />
        </label>
        <CardList isTitans={this.state.isTitans} />
      </div>
    );
  }
}
