"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var Action = (function () {
    function Action() {
        Action.prototype = new (config_1.Config.get());
    }
    return Action;
}());
exports.Action = Action;
