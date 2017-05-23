"use strict";
exports.__esModule = true;
var fs = require("fs");
var express = require("express");
var util = require("util");
var config_1 = require("./config");
var debug = require("debug");
var _ = require("lodash");
var path = require("path");
var routeLog = debug('express-route-auto:route');
var renderLog = debug('express-route-auto:render');
var confLog = debug('express-route-auto:configs');
var mapLog = debug('express-route-auto:map');
var errLog = debug('express-route-auto:error');
var router = express.Router();
// 获取 routePath => file map
function getModulesMap(filePath, parentPath) {
    return fs
        .statSync(filePath)
        .isDirectory() ?
        (fs
            .readdirSync(filePath)
            .map(function (item) {
            return fs
                .statSync(path.join(filePath, item))
                .isDirectory() ?
                (getModulesMap(path.join(filePath, item), path.join(parentPath, item)).length ?
                    (_a = {}, _a[path.join(parentPath, item)] = getModulesMap(path.join(filePath, item), path.join(parentPath, item)), _a)
                    : undefined)
                : (_b = {}, _b[path.join(parentPath, (item === 'index.js' ? '/' : item.split('.')[0]))] = path.join(filePath, item), _b);
            var _a, _b;
        })
            .filter(function (val) { return val !== undefined; }))
        : undefined;
}
exports.getModulesMap = getModulesMap;
// 将 getModulesMap 转化为一维结构
function formatMap(modulesMap) {
    return modulesMap
        .map(function (item) {
        var key = Object.keys(item);
        return key
            .map(function (val) { return _.isString(item[val]) ? item : formatMap(item[val]); })
            .reduce(function (pre, now) { return Object.assign(pre, now); });
    })
        .reduce(function (pre, now) { return Object.assign(pre, now); });
}
exports.formatMap = formatMap;
var Generate = (function () {
    function Generate(configs) {
        var _this = this;
        /**
         * 生成路由
         */
        this.init = function () {
            var actionsMap = getModulesMap(path.join(_this.configs.APP_PATH, _this.configs.routeDir), '/');
            actionsMap = formatMap(actionsMap);
            var _loop_1 = function () {
                if (actionsMap.hasOwnProperty(action)) {
                    var actionHandle_1 = require(actionsMap[action]);
                    mapLog('pathname: %s, file: %s, Function: %s', action, actionsMap[action], util.inspect(actionHandle_1._post));
                    // 修复window 路径问题 --> express 会是识别为正则表达式
                    action = action.split("\\").join("/");
                    ["all", "get", "post", "head", "put", "delete"].map(function (method) {
                        if (actionHandle_1[method]) {
                            routeLog('method: %s, path: %s', 'delete', action);
                            /**
                             * actionHandle[method] is Array  ==> there are some middleware function in Array
                             */
                            if (actionHandle_1[method] instanceof Array) {
                                router[method].apply(router, [action].concat(actionHandle_1[method]));
                            }
                            else {
                                router[method](action, actionHandle_1[method]);
                            }
                        }
                    });
                }
            };
            // 自动加载路由
            for (var action in actionsMap) {
                _loop_1();
            }
            return router;
        };
        config_1.Config.add(configs.props);
        this.configs = configs;
    }
    return Generate;
}());
exports.Generate = Generate;
