require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ApplicationController from '../ringa/ApplicationController';
import LoadingOverlay from './LoadingOverlay';
import _ from 'lodash';


class AppComponent extends React.Component {
  constructor() {
    super();

    this.state = {
      lists: undefined
    };
  }

  componentDidMount() {
    if (this.controller) {
      throw new Error('WE SHOULDNT BE MOUNTING TWICE');
    }

    this.controller = new ApplicationController(this.refs.application);

    this.controller.watch(['viewListsUpdated'], (model) => {
      this.setState({
        lists: model.lists.concat({})
      });
    });
  }

  mockItem(n) {
    return {
      id: Date.now().toString() + n,
      title: _.sampleSize(['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'Suspendisse', 'ac '], 2).join(' '),
    };
  }

  renderList(list) {
    list.items = _.times(Math.floor(Math.random() * 8 ), this.mockItem);
    return list.id ? <div className="list" key={list.id}>
      <div className="list--title">{list.title}
        <div className="item--delete"><i className="fa fa-times-circle" aria-hidden="true"></i></div>
      </div>

      <div className="list--items">
        {list.items.map(this.renderItem)}
      </div>
      <div className="list--add-item">+</div>
    </div>
    :
    <div className="list--add">+</div>
  }

  renderItem(item) {
    return <div className="item" key={item.id}>
          <div className="item--title">{item.title}</div>
          <div className="item--delete"><i className="fa fa-times-circle" aria-hidden="true"></i></div>
        </div>
  }

  render() {
    let { lists = [] } = this.state;

    let header = 
      (<div className="header">
        <h1 className="header--title">ringa-example-react</h1>
        <div className="header--links">
          <div className="header--link-group">
            <ul>
              <li><a className="header--link" href="https://github.com/jung-digital/ringa">ringa</a></li>
              <li><a className="header--link" href="https://github.com/jung-digital/ringa-example-react">ringa-example-react</a></li>
              <li><a className="header--link" href="https://github.com/jung-digital/ringa-example-server">ringa-example-server</a></li>
            </ul>
          </div>
          <a className="header--link" href="https://github.com/jung-digital/ringa/wiki">wiki</a>
        </div>
      </div>);

    return (
      <div ref="application">
        {header}
        <div className="index">
          {lists.map(this.renderList.bind(this))}
        </div>
        <LoadingOverlay loadingModel={this.controller ? this.controller.injections.loadingModel : undefined}/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
