process.env.NPM_CONFIG_CACHE = '/tmp/.npm-cache';
process.env.NPM_CONFIG_LOGLEVEL = 'warn';
process.env.NPM_CONFIG_USERCONFIG = '/tmp/.npmrc';
process.env.HOME = '/tmp';


const awsServerlessExpress = require('aws-serverless-express');
const next = require('next');
const express = require('express');

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const serverProxy = awsServerlessExpress.createServer(server);

  // Check if running in AWS Lambda or locally
  if (!process.env.AWS_EXECUTION_ENV) {
    // Listening on a port for local development
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  }

  exports.handler = (event, context) => {
    awsServerlessExpress.proxy(serverProxy, event, context);
  };
});
