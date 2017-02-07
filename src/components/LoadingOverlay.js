require('../styles/LoadingOverlay.css');

import React from 'react';

class LoadingOverlay extends React.Component {
  constructor() {
    super();
  }

  renderMessage(message) {
    return <div className="message">{message}</div>
  }

  render() {
    let { messages } = {messages: []}; // this.props.loadingOverlayModel;

    return messages.length ? (
      <div className="overlay-backdrop">
        <div className="overlay">{messages.map()}</div>
        <button onClick={this.props.ringaEvent.cancel()} />
      </div>
    ) : null;
  }
}

export default LoadingOverlay;
