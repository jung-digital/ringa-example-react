import React from 'react';
import {depend, dependency} from 'react-ringa';
import APIModel from '../../global/APIModel';
import classnames from 'classnames';

import './Header.scss';
import loaderGIF from '../../images/loader.gif';
import logo from '../../images/ringa.png';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    /**
     * Look for the activeCalls on the APIModel and injection into this.state.activeCalls so we know when to
     * show the spinner.
     */
    depend(this, dependency(APIModel, 'activeCalls'));
  }

  render() {
    let {activeCalls} = this.state;

    let loaderClassnames = classnames({
      loader: true,
      show: activeCalls > 0
    });

    return <div className="header">
      <h1 className="header--title">
        <img className="logo" src={logo}/>
        <img className={loaderClassnames} width="25" height="25" src={loaderGIF}/>
      </h1>
      <h3 className="header--sub-title">Alpha ReactJS Version</h3>
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
    </div>;
  }
}
