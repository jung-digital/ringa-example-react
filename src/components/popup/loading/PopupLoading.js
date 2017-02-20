import React from 'react';
import './PopupLoading.scss';

import PopupBase from '../PopupBase';
import {depend, dependency} from 'react-ringa';

class PopupLoading extends PopupBase {
  constructor(props) {
    super(props);

    /**
     * Inject into this.state.popupLoadingModel
     */
    depend(this, dependency('popupLoadingModel', 'messages'));
  }

  render() {
    let children = this.state && this.state.messages ? this.state.messages.map(message => {
        return <div key={message}>{message}</div>;
      }) : null;

    return super.render(children);
  }
}

export default PopupLoading;
