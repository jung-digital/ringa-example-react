import React from 'react';
import './Header.scss';

export default class Header extends React.Component {
  render() {
    return <div className="header">
      <h1 className="header--title">Ringa Demo</h1>
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
