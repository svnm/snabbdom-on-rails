import ReactDOMServer from 'react-dom/server';
import createReactElement from './createReactElement';
import buildConsoleReplay from './buildConsoleReplay';
import handleError from './handleError';

export default function serverRenderReactComponent(options) {
  const { name, domNodeId, trace } = options;

  let htmlResult = '';
  let hasErrors = false;

  try {
    const reactElementOrRouterResult = createReactElement(options);
    htmlResult = ReactDOMServer.renderToString(reactElementOrRouterResult);

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
