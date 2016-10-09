'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snabbdomOnRailsPageLoaded = snabbdomOnRailsPageLoaded;
exports.clientStartup = clientStartup;

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _snabbdomJsx = require('snabbdom-jsx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var snabbdom = require('snabbdom'); /** @jsx html */

var patch = snabbdom.init([require('snabbdom/modules/class'), require('snabbdom/modules/props'), require('snabbdom/modules/style'), require('snabbdom/modules/eventlisteners')]);

var SNABBDOM_ON_RAILS_COMPONENT_CLASS_NAME = 'js-snabbdom-on-rails-component';
var SNABBDOM_ON_RAILS_STORE_CLASS_NAME = 'js-snabbdom-on-rails-store';

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
  forEach(fn, SNABBDOM_ON_RAILS_COMPONENT_CLASS_NAME, railsContext);
}

function initializeStore(el, railsContext) {
  var name = el.getAttribute('data-store-name');
  var props = JSON.parse(el.getAttribute('data-props'));
  var storeGenerator = _index2.default.getStoreGenerator(name);
  var store = storeGenerator(props, railsContext);
  _index2.default.setStore(name, store);
}

function forEachStore(railsContext) {
  forEach(initializeStore, SNABBDOM_ON_RAILS_STORE_CLASS_NAME, railsContext);
}

function turbolinksVersion5() {
  return typeof Turbolinks.controller !== 'undefined';
}

/**
 * Used for client rendering by SnabbdomOnRails
 * @param el
 */
function render(el, railsContext) {
  var name = el.getAttribute('data-component-name');
  var domNodeId = el.getAttribute('data-dom-id');
  var props = JSON.parse(el.getAttribute('data-props'));
  var trace = JSON.parse(el.getAttribute('data-trace'));

  try {
    var domNode = document.getElementById(domNodeId);
    if (domNode) {

      var componentObj = _index2.default.getComponent(name);
      patch(domNode, (0, _snabbdomJsx.html)(componentObj.component, props));

      /*
            function main(initState, oldVnode, {view, update}) {
              const newVnode = view(initState, e => {
                const newState = update(initState, e);
                main(newState, newVnode, {view, update});
              });
              patch(oldVnode, newVnode);
            }
      
            main(
              0, // the initial state
              domNode,
              elem.component()
            );
      */
    }
  } catch (e) {
    e.message = 'SnabbdomOnRails encountered an error while rendering component: ' + name + '.' + ('Original message: ' + e.message);
    throw e;
  }
}

function parseRailsContext() {
  var el = document.getElementById('js-snabbdom-on-rails-context');
  if (el) {
    return JSON.parse(el.getAttribute('data-rails-context'));
  }

  return null;
}

function snabbdomOnRailsPageLoaded() {
  debugTurbolinks('snabbdomOnRailsPageLoaded');

  var railsContext = parseRailsContext();
  forEachStore(railsContext);
  forEachComponent(render, railsContext);
}

function unmount(el) {
  var domNodeId = el.getAttribute('data-dom-id');
  var domNode = document.getElementById(domNodeId);
  /* ReactDOM.unmountComponentAtNode(domNode); */
}

function snabbdomOnRailsPageUnloaded() {
  debugTurbolinks('snabbdomOnRailsPageUnloaded');
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
  if (context.__SNABBDOM_ON_RAILS_EVENT_HANDLERS_RAN_ONCE__) {
    return;
  }
  context.__SNABBDOM_ON_RAILS_EVENT_HANDLERS_RAN_ONCE__ = true;

  debugTurbolinks('Adding DOMContentLoaded event to install event listeners.');

  document.addEventListener('DOMContentLoaded', function () {
    // Install listeners when running on the client (browser).
    // We must do this check for turbolinks AFTER the document is loaded because we load the
    // Webpack bundles first.

    if (!turbolinksInstalled()) {
      debugTurbolinks('NOT USING TURBOLINKS: DOMContentLoaded event, calling snabbdomOnRailsPageLoaded');
      snabbdomOnRailsPageLoaded();
    } else if (turbolinksVersion5()) {
      debugTurbolinks('USING TURBOLINKS 5: document added event listeners turbolinks:before-render and ' + 'turbolinks:load.');
      document.addEventListener('turbolinks:before-render', snabbdomOnRailsPageUnloaded);
      document.addEventListener('turbolinks:load', snabbdomOnRailsPageLoaded);
    } else {
      debugTurbolinks('USING TURBOLINKS 2: document added event listeners page:before-unload and ' + 'page:change.');
      document.addEventListener('page:before-unload', snabbdomOnRailsPageUnloaded);
      document.addEventListener('page:change', snabbdomOnRailsPageLoaded);
    }
  });
}