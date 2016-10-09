'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  wrapInScriptTags: function wrapInScriptTags(scriptBody) {
    if (!scriptBody) {
      return '';
    }

    return '\n<script>\n' + scriptBody + '\n</script>';
  }
};