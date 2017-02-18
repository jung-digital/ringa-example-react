import React from 'react';
import './Intro.scss';

export default class Intro extends React.Component {
  render() {
    return <div className="intro">
      <h1>Welcome to the Ringa ReactJS Demo</h1>

      <div>Documentation:</div>
      <ul>
        <li><a href="http://www.github.com/jung-digital/ringa/wiki" target="_blank">Ringa Wiki</a></li>
      </ul>

      <div>Code:</div>
      <ul>
        <li><a href="http://www.github.com/jung-digital/ringa" target="_blank">Ringa</a></li>
        <li><a href="http://www.github.com/jung-digital/react-ringa" target="_blank">Ringa React Plugin</a></li>
        <li><a href="http://www.github.com/jung-digital/ringa-example-react" target="_blank">Ringa ReactJS Demo</a></li>
      </ul>


      <div>To keep the demo simple, each session is assigned a token and all activity in the session is associated with the token. Sessions are not designed to be shared between browsers or errors will occur.</div>
    </div>;
  }
}
