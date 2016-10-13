'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var handleError = function handleError(options) {
  var e = options.e;
  var jsCode = options.jsCode;
  var serverSide = options.serverSide;


  console.error('Exception in rendering!');

  if (jsCode) {
    console.error('JS code was: ' + jsCode);
  }

  if (e.fileName) {
    console.error('location: ' + e.fileName + ':' + e.lineNumber);
  }

  console.error('message: ' + e.message);
  console.error('stack: ' + e.stack);

  var msg = '';
  if (serverSide) {
    msg += 'Exception in rendering!\n' + (e.fileName ? '\nlocation: ' + e.fileName + ':' + e.lineNumber : '') + '\nMessage: ' + e.message + '\n\n' + e.stack;

    return msg;
  }

  return undefined;
};

exports.default = handleError;