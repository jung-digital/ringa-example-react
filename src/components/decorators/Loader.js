import React from 'react';
import './Loader.scss';
import loaderGIF from '../../images/loader.gif';

/**
 * The Loader is a wrapper for another set of components.
 */
export default class Loader extends React.Component {
  render() {
    let {height = 34} = this.props;

    // Loading...
    if (this.props.loading) {
      return <div className="loader-container loader-wrapper" style={{height}}>
        <img src={loaderGIF} />
      </div>;
    }

    // Children
    return <div className="loader-container">
        {this.props.children}
      </div>;
  }
}
