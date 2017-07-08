require('babel-register')();
require('babel-polyfill');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const exposedProperties = [
  'window',
  'navigator',
  'document',
];

const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.document = window.document;
global.window = window;
Object.keys(window).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
