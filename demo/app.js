const express = require('express');
const util = require('util')
const { config, Generate } = require('../index');

const conf = require('./conf');

const port = 3000;

config.add(conf);

let app = express();

app.get('/123/', (req, res, next) => {
  next()
})

let generate = new Generate();
// let routes = generate()
app.use(generate());

app.listen(port, () => {
  console.info(`server is running on port: ${port}`);
})
