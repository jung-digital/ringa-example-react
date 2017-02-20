import React from 'react';
import {find} from 'react-ringa';
import AppModel from '../../global/AppModel';
import classnames from 'classnames';

import './Inspector.scss';

export default class Inspector extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.appModel = find(this, AppModel);
  }

  render() {
    return <div className="inspector">
      <div>Ringa Debugging</div>
      <div className="panels"></div>
    </div>;
  }
}
