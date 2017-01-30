require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ApplicationController from '../ringa/ApplicationController';
import LoadingOverlay from './LoadingOverlay';

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
        lists: model.lists
      });
    });
  }

  renderList(list) {
    return <div className="list" key={list.id}>
      <div className="title">{list.title}</div>
    </div>
  }

  render() {
    let { lists = [] } = this.state;

    return (
      <div ref="application">
        <div className="index">
          {lists.map(this.renderList)}
        </div>
        <LoadingOverlay loadingModel={this.controller ? this.controller.injections.loadingModel : undefined}/>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
