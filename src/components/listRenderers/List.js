import React from 'react';
import './List.scss';

import {dispatch} from 'ringa';
import {watch, find} from 'react-ringa';
import classnames from 'classnames';

import AppController from '../../global/AppController';
import AppModel from '../../global/AppModel';

import {depend, dependency} from 'react-ringa';

import Loader from '../decorators/Loader';
import Item from './Item';

export default class List extends React.Component {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props);

    this.watch(props);

    depend(this, [
      dependency(AppModel, 'editItem'),
      dependency(AppModel, 'editList')
    ]);

    this.addItemClickHandler = this.addItemClickHandler.bind(this);
    this.deleteListClickHandler = this.deleteListClickHandler.bind(this);
    this.headerClickHandler = this.headerClickHandler.bind(this);
    this.inputTitleBlurHandler = this.inputTitleBlurHandler.bind(this);
    this.inputDescriptionBlurHandler = this.inputDescriptionBlurHandler.bind(this);
    this.inputKeyUpHandler = this.inputKeyUpHandler.bind(this);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  save() {
    if (!this.refs.inputTitle) {
      return;
    }

    this.props.list.title = this.refs.inputTitle.value;
    this.props.list.description = this.refs.inputDescription.value;

    this.appModel.endEditList(this.props.list);

    dispatch(AppController.SAVE_LIST, {
      list: this.props.list,
      autoAddItem: this.props.list.items.length === 0,
      autoEdit: true
    }, this.refs.root);
  }

  checkBlur() {
    // When pressing 'tab', the transition to the description does not happen immediately.
    setTimeout(() => {
      if (document.activeElement !== this.refs.inputTitle && document.activeElement !== this.refs.inputDescription) {
        this.save();
      }
    }, 20);
  }

  tryFocusEditing() {
    if (this.props.list.editing) {
      if (this.refs.inputTitle !== document.activeElement &&
        this.refs.inputDescription !== document.activeElement) {
        this.refs.inputTitle.focus();
      }
    }
  }

  watch(props) {
    // We watch the list. Every time a property changes on it, our component will forceUpdate()
    watch(this, props.list);
  }

  componentWillReceiveProps(nextProps) {
    this.watch(nextProps);
  }

  componentDidUpdate() {
    this.tryFocusEditing();
  }

  componentDidMount() {
    this.appModel = find(this, AppModel);

    this.tryFocusEditing();
  }

  render() {
    let { id, title, description, items, loading, editing } = this.state.list;
    let { editItem, editList } = this.state;

    let header = editing ?
      <div className="list--header" onClick={this.headerClickHandler}>
        <div className="list--title">
          <input ref="inputTitle" defaultValue={title} onBlur={this.inputTitleBlurHandler} onKeyUp={this.inputKeyUpHandler} tabIndex="1" />
        </div>
        <div className="list--description">
          <input ref="inputDescription" defaultValue={description} onBlur={this.inputDescriptionBlurHandler} onKeyUp={this.inputKeyUpHandler} tabIndex="2" />
        </div>
      </div>
      :
      <div className="list--header list--header-not-editing" onClick={this.headerClickHandler}>
        <div className="list--title list--title-text">{title || 'Click to edit...'}
          <div className="list--delete" onClick={this.deleteListClickHandler}>
            <i className="fa fa-times-circle" aria-hidden="true"></i>
          </div>
        </div>
        <div className="list--description">{description}</div>
      </div>;

    let addClassNames = classnames({
      'list--add-item': true,
      'hide': editItem || editList
    });

    return <div className="list" key={id} ref="root">
        <div className="list--container">
          {header}
          <div className="list--content">
            <Loader loading={loading}>
              <div className="list--items">
                {items.map(item => <Item key={item || item.id} item={item} />)}
              </div>
            </Loader>
          </div>
          <div className={addClassNames} onClick={this.addItemClickHandler}>+ Item</div>
        </div>
      </div>;
  }

  //-----------------------------------
  // Events
  //-----------------------------------
  addItemClickHandler() {
    dispatch(AppController.ADD_ITEM_TO_LIST, {
      list: this.props.list,
      autoEdit: true
    }, this.refs.root);
  }

  deleteListClickHandler(event) {
    event.stopPropagation();

    dispatch(AppController.DELETE_LIST, {
      listId: this.props.list.id
    }, this.refs.root);
  }

  headerClickHandler() {
    this.appModel.startEditList(this.props.list);
  }

  inputTitleBlurHandler() {
    this.checkBlur();
  }

  inputDescriptionBlurHandler() {
    this.checkBlur();
  }

  inputKeyUpHandler(event) {
    if (event.key === 'Enter') {
      this.save();
    }
  }
}
