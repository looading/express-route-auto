const fs = require('fs');
const express = require('express');
const util = require('util');
const Config = require('../config');
const debug = require('debug');
const _ = require('lodash');
const logTheme = require('log-theme');
const path = require('path');
let routeLog = debug('express-route-auto:route');
let renderLog = debug('express-route-auto:render');
let confLog = debug('express-route-auto:configs');
let mapLog = debug('express-route-auto:map')
let errLog = debug('express-route-auto:error')
let router = express.Router();

// 获取 routePath => file map
function getModulesMap (filePath, parentPath) {
  return fs
    .statSync(filePath)
    .isDirectory()?
    (fs
      .readdirSync(filePath)
      .map(item => fs
          .statSync(path.join(filePath, item))
          .isDirectory()?
          (getModulesMap(path.join(filePath, item), path.join(parentPath, item)).length? 
            ({ [ path.join(parentPath, item) ]: getModulesMap(path.join(filePath, item), path.join(parentPath, item)) }) 
            : undefined)
          : ({ [ path.join(parentPath, (item === 'index.js' ? '/': item.split('.')[0])) ]: path.join(filePath, item) }))
      .filter(val => val!== undefined))
    : undefined
}

// 将 getModulesMap 转化为一维结构
function formatMap (modulesMap) {
  return modulesMap
    .map(item => {
      let key = Object.keys(item)
      return key
        .map(val => _.isString(item[key])? item : formatMap(item[key]))
        .reduce((pre, now) => Object.assign(pre, now))
    })
    .reduce((pre, now) => Object.assign(pre, now))
}

class Generate {
  constructor() {
    this.configs = Config.get();
    this.generate = this.generate.bind(this)
    return this.generate;
  }
  /**
   * 生成路由
   */
  generate() {
  	let actionsMap = getModulesMap(path.join(this.configs.APP_PATH, this.configs.routeDir), '/');
    actionsMap = formatMap(actionsMap)

  	// 自动加载路由
  	for (var action in actionsMap) {
  		if (actionsMap.hasOwnProperty(action)) {
        let actionHandle = require(actionsMap[action]);
        mapLog('pathname: %s, file: %s, Function: %s', action, actionsMap[action], util.inspect(actionHandle._post))
        // method get
        if(actionHandle._get) {
          routeLog('method: %s, path: %s', 'get', action);
          router.get(action, actionHandle._get);
        }
        // method post
  			if(actionHandle._post) {
          routeLog('method: %s, path: %s', 'post', action);
          router.post(action, actionHandle._post);
        }
  		}
  	}
  	return router;
  }

}

module.exports = {
  Generate,
  getModulesMap,
  formatMap
};
