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
  constructor(props) {
    super(props);

    this.state = {};

    this.mounted = false;

    console.log('%cStarting Ringa Example ReactJS Application!', 'color: blue; font-weight: bold;');
    console.log(`%cUsing token '${props.token}'. Tokens are not designed to be shared across active sessions due to data corruption, so you are forewarned.`, 'color: blue; font-weight: bold;');

    attach(this, new APIController(props.token));
    attach(this, new AppController());
    attach(this, new PopupLoadingController());

    depend(this, dependency(AppModel, 'windowScrollAllowed'));
  }

  componentDidMount() {
    this.mounted = true;
  }

  render() {
    let classes = classnames({
      app: true,
      show: this.mounted,
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
