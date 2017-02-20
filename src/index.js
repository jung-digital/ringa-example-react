import 'core-js/fn/object/assign';
import shortid from 'shortid';
import qp from 'query-params';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './components/App';

const query = qp.decode(window.location.search.substr(1));

//-------------------------------------
// Generate a token (if not provided)
//-------------------------------------
const token = query.token || shortid.generate();

//-------------------------------------
// Pull in Ringa settings
//-------------------------------------
/**
 * These are set in the Inspector by the user.
 */
window.__generalControllerOptions = {
  throttle: {
    min: parseInt(query.tMin),
    max: parseInt(query.tMax)
  }
};

/**
 * These are set in the Inspector by the user.
 *
 * API are separate from other Controllers so you can test longer API controllers.
 */
window.__apiControllerOptions = {
  throttle: {
    min: parseInt(query.tMinApi),
    max: parseInt(query.tMaxApi)
  }
};

//-------------------------------------
// Setup Full URL
//-------------------------------------

window.updateQuery = () => {
  let v = (value) => {
    return !isNaN(value) ? value : undefined;
  };

  query.token = token;
  query.tMin = v(window.__generalControllerOptions.throttle.min);
  query.tMax = v(window.__generalControllerOptions.throttle.max);
  query.tMinApi = v(window.__apiControllerOptions.throttle.min);
  query.tMaxApi = v(window.__apiControllerOptions.throttle.max);

  const newSearch = `?${qp.encode(query)}`;

  var newURL = window.location.protocol + '//' + window.location.host + window.location.pathname + newSearch;
  window.history.pushState({path:newURL},'',newURL);
};

window.updateQuery();

// Render the main component into the dom
ReactDOM.render(<App token={token} />, document.getElementById('app'));
