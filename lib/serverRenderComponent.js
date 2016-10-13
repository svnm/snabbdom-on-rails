'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = serverRenderComponent;

var _SnabbdomOnRails = require('./SnabbdomOnRails');

var _SnabbdomOnRails2 = _interopRequireDefault(_SnabbdomOnRails);

var _snabbdomJsx = require('snabbdom-jsx');

var _buildConsoleReplay = require('./buildConsoleReplay');

var _buildConsoleReplay2 = _interopRequireDefault(_buildConsoleReplay);

var _handleError = require('./handleError');

var _handleError2 = _interopRequireDefault(_handleError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toHTML = require('snabbdom-to-html'); /** @jsx html */
function serverRenderComponent(options) {
  var name = options.name;
  var domNodeId = options.domNodeId;
  var trace = options.trace;


  var htmlResult = '';
  var hasErrors = false;

  try {
    var componentObj = SnabbdomOnRails.getComponent(name);
    var _htmlResult = toHTML((0, _snabbdomJsx.html)(componentObj.component, null));
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