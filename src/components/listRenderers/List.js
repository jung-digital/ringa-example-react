import React from 'react';
import './List.scss';

import {dispatch} from 'ringa';
import {depend, dependency, watch} from 'react-ringa';

import AppController from '../../global/AppController';
import AppModel from '../../global/AppModel';

import Loader from '../decorators/Loader';
import Item from './Item';

export default class List extends React.Component {
  constructor(props) {
    super(props);

    this.watch(props);

    depend(this, dependency(AppModel, 'editItem'));

    this.addItemClickHandler = this.addItemClickHandler.bind(this);
    this.deleteListClickHandler = this.deleteListClickHandler.bind(this);
  }

  watch(props) {
    watch(this, props.list);
  }

  componentWillReceiveProps(nextProps) {
    this.watch(nextProps);
  }

  render() {
    let { id, title, description, items, loading } = this.props.list;
    let { editItem = {} } = this.props;

    return <div className="list" key={id} ref="root">
        <div className="list--container">
          <div className="list--title">{title}
            <div className="item--delete" onClick={this.deleteListClickHandler}>
              <i className="fa fa-times-circle" aria-hidden="true"></i>
            </div>
          </div>
          <div className="list--description">{description}</div>
          <div className="list--content">
            <Loader loading={loading}>
              <div className="list--items">
                {items.map(item => <Item key={item || item.id} item={item} editing={item.id === editItem.id}/>)}
              </div>
              <div className="list--add-item" onClick={this.addItemClickHandler}>+</div>
            </Loader>
          </div>
        </div>
      </div>;
  }

  addItemClickHandler() {
    dispatch(AppController.ADD_ITEM_TO_LIST, {
      list: this.props.list,
      autoEdit: true
    }, this.refs.root);
  }

  deleteListClickHandler() {
    dispatch(AppController.DELETE_LIST, {
      listId: this.props.list.id
    }, this.refs.root);
  }
}
