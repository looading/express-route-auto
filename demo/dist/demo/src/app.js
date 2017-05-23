"use strict";
exports.__esModule = true;
var express = require("express");
var typing_1 = require("../../typing");
var port = 3000;
var app = express();
app.get('/123/', function (req, res, next) {
    next();
});
var generate = new typing_1.Generate({
    // routeDir 是必须的， 是controller的文件地址（相对于根目录））
    routeDir: 'controller',
    // APP_PATH 也是必须的，是模块获取到根目录路径
    APP_PATH: __dirname,
    props: {
        Name: 'looading'
    }
});
// let routes = generate()
app.use(generate.init());
app.listen(port, function () {
    console.info("server is running on port: " + port);
});
