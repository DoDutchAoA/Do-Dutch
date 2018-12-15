/* setup.js */
require('react-native-mock-render/mock');

import fetchMock from 'fetch-mock'
afterEach(fetchMock.restore)

var jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { document } = (new JSDOM('')).window;
global.document = document;
