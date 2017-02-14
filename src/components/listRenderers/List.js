import React from 'react';
import './List.scss';

import {dispatch} from 'ringa';
import {depend, dependency} from 'react-ringa';

import AppController from '../../global/AppController';
import AppModel from '../../global/AppModel';

import Loader from '../decorators/Loader';
import Item from './Item';

export default class List extends React.Component {
  constructor() {
    super();

    depend(this, dependency(AppModel, 'editItem'));

    this.addItemClickHandler = this.addItemClickHandler.bind(this);
  }

  render() {
    let { id, title, items, loading } = this.props.list;
    let { editItem = {} } = this.props;

    return <div className="list" key={id} ref="root">
        <Loader loading={loading}>
          <div className="list--title">{title}
            <div className="item--delete">
              <i className="fa fa-times-circle" aria-hidden="true"></i>
            </div>
          </div>

          <div className="list--items">
            {items.map(item => <Item  key={item.id} item={item} editing={item.id === editItem.id}/>)}
          </div>
          <div className="list--add-item" onClick={this.addItemClickHandler}>+</div>
        </Loader>
      </div>;
  }

  addItemClickHandler() {
    dispatch(AppController.ADD_ITEM_TO_LIST, {list: this.props.list}, this.refs.root).then(() => {
      this.forceUpdate();
    });
  }
}
