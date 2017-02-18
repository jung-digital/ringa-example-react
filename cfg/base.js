'use strict';
let path = require('path');
let defaultSettings = require('./defaults');
require('dotenv').config();

module.exports = {
  devtool: 'eval',
  output: {
    path: path.join(__dirname, '/../dist/assets'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      components: `${defaultSettings.srcPath}/components/`,
      sources: `${defaultSettings.srcPath}/sources/`,
      styles: `${defaultSettings.srcPath}/styles/`,
      config: `${defaultSettings.srcPath}/config/` + process.env.REACT_WEBPACK_ENV,
      'react/lib/ReactMount': 'react-dom/lib/ReactMount'
    }
  },
  module: {}
};
