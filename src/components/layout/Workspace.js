import React from 'react';
import './Workspace.scss';
import AppModel from '../../global/AppModel';
import AppController from '../../global/AppController';
import List from '../listRenderers/List';
import Intro from './Intro';

import {dispatch} from 'ringa';
import {depend, dependency} from 'react-ringa';

export default class Workspace extends React.Component {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    depend(this, dependency(AppModel, 'lists'));

    this.addListClickHandler = this.addListClickHandler.bind(this);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  render() {
    let { lists = [] } = this.state;

    return <div className="workspace" ref="root">
      {lists.length === 0 ? <Intro /> : lists.map(list => <List key={list.id} list={list} />)}
      <button className="add-list" onClick={this.addListClickHandler}>+ List</button>
    </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  addListClickHandler() {
    dispatch(AppController.ADD_LIST, {
      autoEdit: true
    }, this.refs.root);
  }
}
