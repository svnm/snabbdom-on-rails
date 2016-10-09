'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  authenticityToken: function authenticityToken() {
    var token = document.querySelector('meta[name="csrf-token"]');
    return token ? token.content : null;
  },
  authenticityHeaders: function authenticityHeaders() {
    var otherHeaders = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return Object.assign(otherHeaders, {
      'X-CSRF-Token': this.authenticityToken(),
      'X-Requested-With': 'XMLHttpRequest'
    });
  }
};