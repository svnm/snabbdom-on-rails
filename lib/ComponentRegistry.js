'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// key = name used by react_on_rails
// value = { name, component }

var registeredComponents = new Map();

exports.default = {
  /**
   * @param components { component1: component1, component2: component2, etc. }
   */
  register: function register(components) {
    Object.keys(components).forEach(function (name) {
      if (registeredComponents.has(name)) {
        console.warn('Called register for component that is already registered', name);
      }

      var component = components[name];
      if (!component) {
        throw new Error('Called register with null component named ' + name);
      }

      registeredComponents.set(name, {
        name: name,
        component: component
      });
    });
  },


  /**
   * @param name
   * @returns { name, component }
   */
  get: function get(name) {
    if (registeredComponents.has(name)) {
      return registeredComponents.get(name);
    }

    var keys = Array.from(registeredComponents.keys()).join(', ');
    throw new Error('Could not find component registered with name ' + name + '. Registered component names include [ ' + keys + ' ]. Maybe you forgot to register the component?');
  },


  /**
   * Get a Map containing all registered components. Useful for debugging.
   * @returns Map where key is the component name and values are the
   * { name, component }
   */
  components: function components() {
    return registeredComponents;
  }
};