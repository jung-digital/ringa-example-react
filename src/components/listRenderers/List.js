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

    /**
     * The watch() function watches a Model that is already available to us. depend() does a lookup for a model and
     * a property.
     *
     * Both of them by default update the React component when they detect a change.
     *
     * In this case, we might have the list provided to us on the props. But we don't have access to the AppModel, so
     * we have to look for it.
     */
    this.watch(props);

    depend(this, dependency(AppModel, ['editItem', 'editList']));

    this.addItemClickHandler = this.addItemClickHandler.bind(this);
    this.deleteListClickHandler = this.deleteListClickHandler.bind(this);
    this.headerClickHandler = this.headerClickHandler.bind(this);
    this.inputKeyUpHandler = this.inputKeyUpHandler.bind(this);
    this.save = this.save.bind(this);
    this.mouseBlock = this.mouseBlock.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  save(autoAddItem = false) {
    if (!this.refs.inputTitle) {
      return;
    }

    this.props.list.title = this.refs.inputTitle.value;
    this.props.list.description = this.refs.inputDescription.value;

    dispatch(AppController.SAVE_LIST, {
      list: this.props.list,
      autoAddItem,
      autoEdit: true
    }, this.refs.root);
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

    window.addEventListener('mouseup', this.mouseUpHandler);

    this.tryFocusEditing();
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.mouseUpHandler);
  }

  render() {
    /**
     * All of these properties are injected by watch() or depend() setup in the constructor.
     */
    let { id, title, description, items, loading, editing } = this.state.list;
    let { editItem, editList } = this.state;

    let header = editing ?
      <div className="list--header" onClick={this.headerClickHandler} onMouseUp={this.mouseBlock}>
        <div className="list--title">
          <input ref="inputTitle" defaultValue={title} onKeyUp={this.inputKeyUpHandler} tabIndex="1" placeholder="Title" />
        </div>
        <div className="list--description">
          <input ref="inputDescription" defaultValue={description} onKeyUp={this.inputKeyUpHandler} tabIndex="2" placeholder="Description" />
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

    let somethingIsBeingEdited = editItem || editList;
    let editingListOrItem = somethingIsBeingEdited && (editList === this.state.list || (editItem && editItem.parentList === this.state.list));

    let listClassNames = classnames({
      list: true,
      hide: !editingListOrItem && somethingIsBeingEdited
    });

    let addItemClassNames = classnames({
      'list--add-item': true,
      hide: editingListOrItem && editList
    });

    return <div className={listClassNames} key={id} ref="root">
        <div className="list--container">
          {header}
          <div className="list--content">
            <Loader loading={loading} height={items.length * 35}>
              <div className="list--items">
                {items.map(item => <Item key={item.id} item={item} />)}
              </div>
            </Loader>
          </div>
          <div className={addItemClassNames} onClick={this.addItemClickHandler}>Add Item...</div>
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

  inputKeyUpHandler(event) {
    if (event.key === 'Enter') {
      this.save();
    }
  }

  mouseBlock(event) {
    event.stopPropagation();
  }

  mouseUpHandler() {
    if (this.state.list && this.state.list.editing) {
      this.save(this.state.list.items.length === 0);
    }
  }
}
