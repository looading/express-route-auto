const express = require('express');

const { config, Generate } = require('../index');

const conf = require('./conf');

const port = 3000;

config.add(conf);

let app = express();


let generate = new Generate();
app.use(generate());



app.listen(port, () => {
  console.info(`server is running on port: ${port}`);
})
