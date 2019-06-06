import React from 'react';
export class Card extends React.Component {
  render() {
    return (
      <div
        onMouseDown={this.props.onMouseDown}
        onTouchStart={this.props.onTouchStart}
        className={this.props.className}></div>
    );
  }
}