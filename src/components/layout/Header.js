import React from 'react';
import {depend, dependency} from 'react-ringa';
import APIModel from '../../global/APIModel';
import classnames from 'classnames';

import './Header.scss';
import loaderGIF from '../../images/loader.gif';

export default class Header extends React.Component {
  constructor(props) {
    super(props);

    depend(this, dependency(APIModel, 'activeCalls'));
  }

  render() {
    let {activeCalls} = this.state;

    let loaderClassnames = classnames({
      show: activeCalls > 0
    });

    return <div className="header">
      <h1 className="header--title">Ringa Demo <img className={loaderClassnames} width="25" height="25" src={loaderGIF}/></h1>
      <h3 className="header--title">Alpha ReactJS Version</h3>
      <div className="header--links">
        <div className="header--link-group">
          <ul>
            <li><a className="header--link" href="https://github.com/jung-digital/ringa">ringa</a></li>
            <li><a className="header--link" href="https://github.com/jung-digital/ringa-example-react">ringa-example-react</a></li>
            <li><a className="header--link" href="https://github.com/jung-digital/ringa-example-server">ringa-example-server</a></li>
          </ul>
        </div>
        <a className="header--link" href="https://github.com/jung-digital/ringa/wiki">wiki</a>
        <div style={{width: '130px'}}/>
      </div>
    </div>;
  }
}
