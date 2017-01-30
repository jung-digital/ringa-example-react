require('../styles/LoadingOverlay.css');

import React from 'react';

class LoadingOverlay extends React.Component {

  renderMessage(message) {
    return <div className="message">{message}</div>
  }

  render() {
    if (!this.props.controller) {
      return null;
    }

    let { messages } = this.props.controller.injections.loadingOverlayModel;

    return messages.length ? (
      <div className="overlay-backdrop">
        <div className="overlay">{messages.map()}</div>
      </div>
    ) : undefined;
  }
}

export default LoadingOverlay;
