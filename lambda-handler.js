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
  
  exports.handler = (event, context) => {
    awsServerlessExpress.proxy(serverProxy, event, context);
  };
});
