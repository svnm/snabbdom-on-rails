/** @jsx html */
import ReactOnRails from './SnabbdomOnRails';
const toHTML = require('snabbdom-to-html')
import { html } from 'snabbdom-jsx';
import buildConsoleReplay from './buildConsoleReplay';
import handleError from './handleError';

export default function serverRenderComponent(options) {
  const { name, domNodeId, trace } = options;

  let htmlResult = '';
  let hasErrors = false;

  try {
    const componentObj = SnabbdomOnRails.getComponent(name);
    const htmlResult = toHTML(<componentObj.component />);

  } catch (e) {
    hasErrors = true;
    htmlResult = handleError({
      e,
      name,
      serverSide: true,
    });
  }

  const consoleReplayScript = buildConsoleReplay();

  return JSON.stringify({
    html: htmlResult,
    consoleReplayScript,
    hasErrors,
  });
}
