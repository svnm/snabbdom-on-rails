'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reactOnRailsPageLoaded = reactOnRailsPageLoaded;
exports.clientStartup = clientStartup;

var _SnabbdomOnRails = require('./SnabbdomOnRails');

var _SnabbdomOnRails2 = _interopRequireDefault(_SnabbdomOnRails);

var _snabbdomJsx = require('snabbdom-jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var snabbdom = require('snabbdom'); /** @jsx html */

var patch = snabbdom.init([require('snabbdom/modules/class'), require('snabbdom/modules/props'), require('snabbdom/modules/style'), require('snabbdom/modules/eventlisteners')]);

var REACT_ON_RAILS_COMPONENT_CLASS_NAME = 'js-react-on-rails-component';
var REACT_ON_RAILS_STORE_CLASS_NAME = 'js-react-on-rails-store';

function debugTurbolinks() {
  if (!window) {
    return;
  }
}

function turbolinksInstalled() {
  return typeof Turbolinks !== 'undefined';
}

function forEach(fn, className, railsContext) {
  var els = document.getElementsByClassName(className);
  for (var i = 0; i < els.length; i++) {
    fn(els[i], railsContext);
  }
}

function forEachComponent(fn, railsContext) {
  forEach(fn, REACT_ON_RAILS_COMPONENT_CLASS_NAME, railsContext);
}

function initializeStore(el, railsContext) {
  var name = el.getAttribute('data-store-name');
  var props = JSON.parse(el.getAttribute('data-props'));
  var storeGenerator = _SnabbdomOnRails2.default.getStoreGenerator(name);
  var store = storeGenerator(props, railsContext);
  _SnabbdomOnRails2.default.setStore(name, store);
}

function forEachStore(railsContext) {
  forEach(initializeStore, REACT_ON_RAILS_STORE_CLASS_NAME, railsContext);
}

function turbolinksVersion5() {
  return typeof Turbolinks.controller !== 'undefined';
}

/**
 * Used for client rendering by ReactOnRails
 * @param el
 */
function render(el, railsContext) {
  var name = el.getAttribute('data-component-name');
  var domNodeId = el.getAttribute('data-dom-id');
  var props = JSON.parse(el.getAttribute('data-props'));
  var trace = JSON.parse(el.getAttribute('data-trace'));

  try {

    /* patch Snabbdom component to domNode */
    var domNode = document.getElementById(domNodeId);
    if (domNode) {

      var componentObj = _SnabbdomOnRails2.default.getComponent(name);
      patch(domNode, (0, _snabbdomJsx.html)(componentObj.component, props));
    }
  } catch (e) {

    e.message = 'ReactOnRails encountered an error while rendering component: ' + name + '.' + ('Original message: ' + e.message);
    throw e;
  }
}

function parseRailsContext() {
  var el = document.getElementById('js-react-on-rails-context');
  if (el) {
    return JSON.parse(el.getAttribute('data-rails-context'));
  }

  return null;
}

function reactOnRailsPageLoaded() {
  debugTurbolinks('reactOnRailsPageLoaded');

  var railsContext = parseRailsContext();
  forEachStore(railsContext);
  forEachComponent(render, railsContext);
}

function unmount(el) {
  var domNodeId = el.getAttribute('data-dom-id');
  var domNode = document.getElementById(domNodeId);
  ReactDOM.unmountComponentAtNode(domNode);
}

function reactOnRailsPageUnloaded() {
  debugTurbolinks('reactOnRailsPageUnloaded');
  forEachComponent(unmount);
}

function clientStartup(context) {
  var document = context.document;

  // Check if server rendering
  if (!document) {
    return;
  }

  // Tried with a file local variable, but the install handler gets called twice.
  // eslint-disable-next-line no-underscore-dangle
  if (context.__REACT_ON_RAILS_EVENT_HANDLERS_RAN_ONCE__) {
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  context.__REACT_ON_RAILS_EVENT_HANDLERS_RAN_ONCE__ = true;

  debugTurbolinks('Adding DOMContentLoaded event to install event listeners.');

  document.addEventListener('DOMContentLoaded', function () {
    // Install listeners when running on the client (browser).
    // We must do this check for turbolinks AFTER the document is loaded because we load the
    // Webpack bundles first.

    if (!turbolinksInstalled()) {
      debugTurbolinks('NOT USING TURBOLINKS: DOMContentLoaded event, calling reactOnRailsPageLoaded');
      reactOnRailsPageLoaded();
    } else if (turbolinksVersion5()) {
      debugTurbolinks('USING TURBOLINKS 5: document added event listeners turbolinks:before-render and ' + 'turbolinks:load.');
      document.addEventListener('turbolinks:before-render', reactOnRailsPageUnloaded);
      document.addEventListener('turbolinks:load', reactOnRailsPageLoaded);
    } else {
      debugTurbolinks('USING TURBOLINKS 2: document added event listeners page:before-unload and ' + 'page:change.');
      document.addEventListener('page:before-unload', reactOnRailsPageUnloaded);
      document.addEventListener('page:change', reactOnRailsPageLoaded);
    }
  });
}