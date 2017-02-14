import React from 'react';
import './Item.scss';

export default class Item extends React.Component {
  render() {
    const {title} = this.props.item;

    return <div className="item">
      <div className="item--title">{title}</div>
      <div className="item--delete"><i className="fa fa-times-circle" aria-hidden="true"></i></div>
    </div>;
  }
}
