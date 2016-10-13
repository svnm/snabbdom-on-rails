import React from 'react';

const handleError = (options) => {
  const { e, jsCode, serverSide } = options;

  console.error('Exception in rendering!');

  if (jsCode) {
    console.error(`JS code was: ${jsCode}`);
  }

  if (e.fileName) {
    console.error(`location: ${e.fileName}:${e.lineNumber}`);
  }

  console.error(`message: ${e.message}`);
  console.error(`stack: ${e.stack}`);

  let msg = ''
  if (serverSide) {
    msg += `Exception in rendering!
${e.fileName ? `\nlocation: ${e.fileName}:${e.lineNumber}` : ''}
Message: ${e.message}

${e.stack}`;

    return msg
  }

  return undefined;
};

export default handleError;
