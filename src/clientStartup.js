/** @jsx html */
import SnabbdomOnRails from './index';
var snabbdom = require('snabbdom');
import { html } from 'snabbdom-jsx';
var patch = snabbdom.init([
  require('snabbdom/modules/class'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style'),
  require('snabbdom/modules/eventlisteners'),
]);


const SNABBDOM_ON_RAILS_COMPONENT_CLASS_NAME = 'js-snabbdom-on-rails-component';
const SNABBDOM_ON_RAILS_STORE_CLASS_NAME = 'js-snabbdom-on-rails-store';

function debugTurbolinks(...msg) {
  if (!window) {
    return;
  }
}

function turbolinksInstalled() {
  return (typeof Turbolinks !== 'undefined');
}

function forEach(fn, className, railsContext) {
  const els = document.getElementsByClassName(className);
  for (let i = 0; i < els.length; i++) {
    fn(els[i], railsContext);
  }
}

function forEachComponent(fn, railsContext) {
  forEach(fn, SNABBDOM_ON_RAILS_COMPONENT_CLASS_NAME, railsContext);
}

function initializeStore(el, railsContext) {
  const name = el.getAttribute('data-store-name');
  const props = JSON.parse(el.getAttribute('data-props'));
  const storeGenerator = SnabbdomOnRails.getStoreGenerator(name);
  const store = storeGenerator(props, railsContext);
  SnabbdomOnRails.setStore(name, store);
}

function forEachStore(railsContext) {
  forEach(initializeStore, SNABBDOM_ON_RAILS_STORE_CLASS_NAME, railsContext);
}

function turbolinksVersion5() {
  return (typeof Turbolinks.controller !== 'undefined');
}

/**
 * Used for client rendering by SnabbdomOnRails
 * @param el
 */
function render(el, railsContext) {
  const name = el.getAttribute('data-component-name');
  const domNodeId = el.getAttribute('data-dom-id');
  const props = JSON.parse(el.getAttribute('data-props'));
  const trace = JSON.parse(el.getAttribute('data-trace'));

  try {
    const domNode = document.getElementById(domNodeId);
    if (domNode) {

      const componentObj = SnabbdomOnRails.getComponent(name);
      patch(domNode, <componentObj.component {...props} /> );

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
    e.message = `SnabbdomOnRails encountered an error while rendering component: ${name}.` +
      `Original message: ${e.message}`;
    throw e;
  }
}

function parseRailsContext() {
  const el = document.getElementById('js-snabbdom-on-rails-context');
  if (el) {
    return JSON.parse(el.getAttribute('data-rails-context'));
  }

  return null;
}

export function snabbdomOnRailsPageLoaded() {
  debugTurbolinks('snabbdomOnRailsPageLoaded');

  const railsContext = parseRailsContext();
  forEachStore(railsContext);
  forEachComponent(render, railsContext);
}

function unmount(el) {
  const domNodeId = el.getAttribute('data-dom-id');
  const domNode = document.getElementById(domNodeId);
  /* ReactDOM.unmountComponentAtNode(domNode); */
}

function snabbdomOnRailsPageUnloaded() {
  debugTurbolinks('snabbdomOnRailsPageUnloaded');
  forEachComponent(unmount);
}

export function clientStartup(context) {
  const document = context.document;

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

  document.addEventListener('DOMContentLoaded', () => {
    // Install listeners when running on the client (browser).
    // We must do this check for turbolinks AFTER the document is loaded because we load the
    // Webpack bundles first.

    if (!turbolinksInstalled()) {
      debugTurbolinks(
        'NOT USING TURBOLINKS: DOMContentLoaded event, calling snabbdomOnRailsPageLoaded'
      );
      snabbdomOnRailsPageLoaded();
    } else if (turbolinksVersion5()) {
      debugTurbolinks(
        'USING TURBOLINKS 5: document added event listeners turbolinks:before-render and ' +
        'turbolinks:load.'
      );
      document.addEventListener('turbolinks:before-render', snabbdomOnRailsPageUnloaded);
      document.addEventListener('turbolinks:load', snabbdomOnRailsPageLoaded);
    } else {
      debugTurbolinks(
        'USING TURBOLINKS 2: document added event listeners page:before-unload and ' +
        'page:change.');
      document.addEventListener('page:before-unload', snabbdomOnRailsPageUnloaded);
      document.addEventListener('page:change', snabbdomOnRailsPageLoaded);
    }
  });
}
