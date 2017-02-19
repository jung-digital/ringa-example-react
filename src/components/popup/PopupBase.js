require('./PopupBase.scss');

import React from 'react';

import PopupBaseModel from './PopupBaseModel';

import {depend, dependency} from 'react-ringa';

/**
 * This class is designed to be extended.
 */
class PopupBase extends React.Component {
  constructor() {
    super();

    /**
     * Will automatically look for a PopupBaseModel and watch 'show' and 'opacity' and inject any
     * changes into this.state.show and this.state.opacity.
     */
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
