require('normalize.css/normalize.css');
require('./App.scss');

import React from 'react';

import AppController from '../global/AppController';
import APIController from '../global/APIController';
import PopupLoadingController from './popup/loading/PopupLoadingController';
import PopupLoading from './popup/loading/PopupLoading';
import AppModel from '../global/AppModel';
import Header from './layout/Header';
import Workspace from './layout/Workspace';

import classnames from 'classnames';

import {attach, depend, dependency} from 'react-ringa';

class App extends React.Component {
  constructor() {
    super();

    this.state = {};

    attach(this, new APIController());
    attach(this, new AppController());
    attach(this, new PopupLoadingController());

    depend(this, dependency(AppModel, 'windowScrollAllowed'));
  }

  render() {
    let classes = classnames({
      app: true,
      'overflow-hidden': !this.state.windowScrollAllowed
    });

    return (
      <div ref="ringaComponent" className={classes}>
        <Header/>
        <Workspace/>
        <PopupLoading />
      </div>
    );
  }
}

export default App;
