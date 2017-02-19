# Live Demo!

[Live demo of this project is found here.](http://demo.ringajs.com)

# ringa-example-react

A Ringa example using ReactJS and [ringa](http://www.github.com/jung-digital/ringa) and [react-ringa](http://www.github.com/jung-digital/react-ringa).

The code has been heavily commented as an educational tool, and it is recommended to start reading in `src/global/AppController` as that is the most involved file with the most functionality.

# Technologies

* Webpack 2.0
* Babel ES2015
* 
# installation

Ringa Examples can run against a *local server* or the hosted demo server at *example-server.ringajs.com*.

## Local Server

* Install MongoDB
* Install [ringa-example-server](http://www.github.com/jung-digital/ringa-example-server)
* Run MongoDB
* Run `ringa-example-server`
* Run `ringa-example-react` with `npm start`

By default this project will try to connect to `http://0.0.0.0:9000/` for its server data.

## RingaJS Example Server

If you want to use the example server, you will need to set the environment variable:

`export API_ROOT = http://example-server.ringajs.com`

## Mobile

If you want to test on mobile running from your local server, you will need to update the webpack-dev-server confuration in `cfg/dev.js`.

Default:
`'webpack-dev-server/client?http://0.0.0.0:' + defaultSettings.port,`

Mobile:
`'webpack-dev-server/client?http://**[YOUR IP ADDRESS]**:' + defaultSettings.port,`
