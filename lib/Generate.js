"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.getModulesMap = function (filePath, parentPath) {
    if (fs.statSync(filePath).isDirectory()) {
        var files = fs
            .readdirSync(filePath)
            .map(function (item) { return fs
            .statSync(path.join(filePath, item))
            .isDirectory() ?
            (exports.getModulesMap(path.join(filePath, item), path.join(parentPath, item)).length ?
                ({ key: path.join(parentPath, item), value: exports.getModulesMap(path.join(filePath, item), path.join(parentPath, item)) })
                : undefined)
            : ({ key: path.join(parentPath, (item === 'index.js' ? '/' : item.split('.')[0])), value: path.join(filePath, item) }); })
            .filter(function (val) { return val !== undefined; });
        // sort route array
        files.sort(function (a, b) {
            var aArr = a.key.split('/');
            var bArr = b.key.split('/');
            if (aArr.length < bArr.length) {
                return 1;
            }
            if (aArr.length > bArr.length) {
                return -1;
            }
            if (aArr.length == bArr.length) {
                return aArr[aArr.length - 1].length > bArr[bArr.length - 1].length ? 1 : -1;
            }
        });
        return files;
    }
    else {
        return undefined;
    }
};
// 将 getModulesMap 转化为一维结构
exports.formatMap = function (modulesMap) {
    return modulesMap
        .map(function (item) {
        return {
            key: item.key,
            value: _.isString(item.value) ? item.value : exports.formatMap(item.value)
        };
    })
        .reduce(function (pre, now) {
        return _.isString(now.value) ? [].concat(pre, now) : [].concat(pre, now.value);
    });
};
var Generate = (function () {
    function Generate(configs) {
        var _this = this;
        /**
         * 生成路由
         */
        this.init = function () {
            var actionsMap = exports.getModulesMap(path.join(_this.configs.APP_PATH, _this.configs.routeDir), '/');
            actionsMap = exports.formatMap(actionsMap);
            actionsMap = actionsMap instanceof Array ? actionsMap : [actionsMap];
            var _loop_1 = function (controller) {
                var action = controller.key;
                var actionModule = controller.value;
                var actionHandle = require(actionModule);
                mapLog('pathname: %s, file: %s, Function: %s', action, actionsMap[action], util.inspect(actionHandle._post));
                // 修复window 路径问题 --> express 会是识别为正则表达式
                action = action.split("\\").join("/");
                // add parmas
                action = action.match(/\/$/g) ? action : [action, '/'].join('');
                ["all", "get", "post", "head", "put", "delete"].map(function (method) {
                    if (actionHandle[method]) {
                        if (actionHandle.params && actionHandle.params[method]) {
                            action = [action, ':', actionHandle.params[method].join('/:')].join('');
                        }
                        routeLog('method: %s, path: %s', 'delete', action);
                        /**
                         * actionHandle[method] is Array  ==> there are some middleware function in Array
                         */
                        if (actionHandle[method] instanceof Array) {
                            router[method].apply(router, [action].concat(actionHandle[method]));
                        }
                        else {
                            router[method](action, actionHandle[method]);
                        }
                        routeLog('Load --> %s :: %s', method, action);
                    }
                });
            };
            // 自动加载路由
            for (var _i = 0, actionsMap_1 = actionsMap; _i < actionsMap_1.length; _i++) {
                var controller = actionsMap_1[_i];
                _loop_1(controller);
            }
            return router;
        };
        config_1.Config.add(configs.props);
        this.configs = configs;
    }
    return Generate;
}());
exports.Generate = Generate;
