require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ApplicationController from '../ringa/ApplicationController';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {

  componentDidMount() {
    this.controller = new ApplicationController(this.refs.application);
  }

  render() {
    return (
      <div className="index" ref="application">
        <img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
