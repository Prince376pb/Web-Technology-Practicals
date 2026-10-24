const serverless = require('serverless-http');
const app = require('../../server/server');

// Wrap the ExpressJS application with serverless-http for Netlify Functions
module.exports.handler = serverless(app);
