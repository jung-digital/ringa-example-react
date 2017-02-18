'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

let config = Object.assign({}, baseConfig, {
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  devServer: {
    contentBase: './src/',
    historyApiFallback: true,
    hot: true,
    port: defaultSettings.port,
    publicPath: defaultSettings.publicPath,
    noInfo: false
  },
  cache: true,
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.API_ROOT': JSON.stringify(process.env.API_ROOT || 'http://localhost:9000')
    })
  ],
  module: defaultSettings.getDefaultModules()
});

config.module.rules.push({
  test: /\.(js|jsx)$/,
  include: path.join(__dirname, '/../src'),
  use: [
    'react-hot-loader',
    'babel-loader'
  ]
});

module.exports = config;
