'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serverRenderReactComponent;

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _createReactElement = require('./createReactElement');

var _createReactElement2 = _interopRequireDefault(_createReactElement);

var _buildConsoleReplay = require('./buildConsoleReplay');

var _buildConsoleReplay2 = _interopRequireDefault(_buildConsoleReplay);

var _handleError = require('./handleError');

var _handleError2 = _interopRequireDefault(_handleError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serverRenderReactComponent(options) {
  var name = options.name;
  var domNodeId = options.domNodeId;
  var trace = options.trace;


  var htmlResult = '';
  var hasErrors = false;

  try {
    var reactElementOrRouterResult = (0, _createReactElement2.default)(options);
    htmlResult = _server2.default.renderToString(reactElementOrRouterResult);
  } catch (e) {
    hasErrors = true;
    htmlResult = (0, _handleError2.default)({
      e: e,
      name: name,
      serverSide: true
    });
  }

  var consoleReplayScript = (0, _buildConsoleReplay2.default)();

  return JSON.stringify({
    html: htmlResult,
    consoleReplayScript: consoleReplayScript,
    hasErrors: hasErrors
  });
}