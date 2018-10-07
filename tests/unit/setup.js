import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { JSDOM } = require('jsdom');

const exposedProperties = ['window', 'navigator', 'document'];

const { window } = new JSDOM('<!doctype html><html><body></body></html>');
global.document = window.document;
global.window = window;

global.navigator = {
  userAgent: 'node.js',
};
