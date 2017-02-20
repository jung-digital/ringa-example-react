import React from 'react';
import './Workspace.scss';
import AppModel from '../../global/AppModel';
import AppController from '../../global/AppController';
import List from '../listRenderers/List';
import Intro from './Intro';

import classnames from 'classnames';

import {dispatch} from 'ringa';
import {depend, dependency} from 'react-ringa';

export default class Workspace extends React.Component {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    /**
     * This will watch for signals 'lists', 'initialized', 'editItem', 'editList' on the first AppModel instance
     * it finds. It will then update the following items when each changes:
     *
     * this.state.lists
     * this.state.initialized
     * this.state.editItem
     * this.state.editList
     * this.state.appModel
     */
    depend(this, dependency(AppModel, ['lists', 'initialized', 'editItem', 'editList']));

    this.addListClickHandler = this.addListClickHandler.bind(this);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  render() {
    let { lists = [], initialized = false, editItem, editList } = this.state;

    if (!initialized) {
      return <div className="workspace" ref="root"></div>;
    }

    let addClassNames = classnames({
      'add-list': true,
      hide: editItem || editList
    });

    let showInspectorClassNames = classnames({
      'show-inspector': true,
      hide: this.state.appModel.showInspector
    });

    return <div className="workspace" ref="root">
      {lists.length === 0 ? <Intro /> : lists.map(list => <List key={list.id} list={list} />)}
      <button className={addClassNames} onClick={this.addListClickHandler}>Add List...</button>
      <button className={showInspectorClassNames} onClick={this.addListClickHandler}>Debug</button>
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
