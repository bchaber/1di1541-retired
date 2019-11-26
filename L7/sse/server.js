'use strict';

const express = require('express');
const sse = require('express-sse');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

var SSE = new sse(["array", "containing", "initial", "content", "(optional)"]);

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello world\n');
  SSE.send('Hello', 'greet');
});
app.get('/stream', SSE.init);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
