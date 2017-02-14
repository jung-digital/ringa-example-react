require('./PopupBase.scss');

import React from 'react';

import PopupBaseModel from './PopupBaseModel';

import {depend, dependency} from 'react-ringa';

class PopupBase extends React.Component {
  constructor() {
    super();

    depend(this, [
      dependency(PopupBaseModel, 'show'),
      dependency(PopupBaseModel, 'opacity')
    ]);
  }

  render(children) {
    return this.state.show ? <div className="popup-overlay" style={{opacity: this.state.opacity}}>
             <div className="popup">
               {children}
             </div>
           </div> : null;
  }
}

export default PopupBase;
