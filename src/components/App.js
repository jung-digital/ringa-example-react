require('normalize.css/normalize.css');
require('./App.scss');

import React from 'react';

import {InspectorController} from 'ringa';
import AppController from '../global/AppController';
import APIController from '../global/APIController';
import PopupLoadingController from './popup/loading/PopupLoadingController';
import PopupLoading from './popup/loading/PopupLoading';
import AppModel from '../global/AppModel';
import Header from './layout/Header';
import Workspace from './layout/Workspace';
import Inspector from './inspector/Inspector';

import classnames from 'classnames';

import {attach, depend, dependency} from 'react-ringa';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.mounted = false;

    console.log('%cStarting Ringa Example ReactJS Application!', 'color: blue; font-weight: bold;');
    console.log(`%cUsing token '${props.token}'. Tokens are not designed to be shared across active sessions due to data corruption, so you are forewarned.`, 'color: blue; font-weight: bold;');

    /**
     * Attach our four main controllers! These are all attached to the document so they receive events from everywhere.
     */
    attach(this, new InspectorController());
    attach(this, new APIController(props.token));
    attach(this, new AppController());
    attach(this, new PopupLoadingController());

    /**
     * Watch appModel.windowScrollAllowed and update this.state.windowScrollAllowed by looking through all our controllers
     * for the first object that extends AppModel.
     */
    depend(this, dependency(AppModel, 'windowScrollAllowed'));
  }

  componentDidMount() {
    this.mounted = true;
  }

  render() {
    /**
     * But watching when the component has been mounted, we can fade in at the appropriate time.
     */
    let classes = classnames({
      app: true,
      show: this.mounted,
      'overflow-hidden': !this.state.windowScrollAllowed
    });

    /**
     * By default, our depend() function needs a DOM node to do its searching. The default name for the ref it looks
     * for is 'ringaComponent'
     */
    return (
      <div ref="ringaComponent" className={classes}>
        <Header/>
        <Inspector />
        <Workspace/>
        <PopupLoading />
      </div>
    );
  }
}

export default App;
