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

var newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + newSearch;
window.history.pushState({path:newURL},'',newURL);

// Render the main component into the dom
ReactDOM.render(<App token={token} />, document.getElementById('app'));
