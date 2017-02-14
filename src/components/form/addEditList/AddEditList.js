import React from 'react';
import './AddEditList.scss';

import {depend, dependency} from 'react-ringa';

class AddEditList extends React.Component {
  constructor() {
    super();

    depend(this, dependency('popupLoadingModel', 'messages'));
  }

  render() {
    let children = this.state && this.state.messages ? this.state.messages.map(message => {
        return <div key={message}>{message}</div>;
      }) : null;

    return super.render(children);
  }
}

export default AddEditList;
