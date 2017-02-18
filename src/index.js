import 'core-js/fn/object/assign';
import shortid from 'shortid';
import qp from 'query-params';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App';

const query = qp.decode(window.location.search.substr(1));

// Generate a token
const token = query.token || shortid.generate();

const newSearch = `?token=${token}`;
if (window.location.search !== newSearch){
  window.location.search = newSearch;
}

// Render the main component into the dom
ReactDOM.render(<App token={token} />, document.getElementById('app'));
