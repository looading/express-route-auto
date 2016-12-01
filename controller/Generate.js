const fs = require('fs');
const express = require('express');
const util = require('util');
const Config = require('../config');
const debug = require('debug');
const _ = require('lodash');
const logTheme = require('log-theme');

let routeLog = debug('express-route-auto:route');
let renderLog = debug('express-route-auto:render');
let confLog = debug('express-route-auto:configs');


let router = express.Router();

class Generate {
  constructor() {
    this.configs = Config.get();
    this.generate = this.generate.bind(this)
    return this.generate;
  }
  /**
   * 获取controller name
   */
  getModules(routeDir) {
  	let dirs = fs.readdirSync(this.configs.APP_PATH + routeDir);
  	let controllers = []

  	// 获取controller
  	dirs.forEach((val, index, arr) => {
  		let stats = fs.statSync(this.configs.APP_PATH + routeDir + '/' + val);
  		controllers.push(val)
  	});
  	return controllers;
  }

  /**
   * 生成 路由 -> 处理函数 Map
   */
  getActionsMap() {
  	let actionsMaps = {};

    let that = this;
  	function render(routeDir) {
  		let controllers = that.getModules(routeDir);
  		//生成 路由->处理函数 Map
  		controllers.forEach((controller, index,  arr) => {
        let stats = fs.statSync(that.configs.APP_PATH + routeDir + '/' + controller)

        if(stats.isFile()) {
          let a = controller == 'index.js' ? '' : controller;
          let baseDir = routeDir.slice(12);
          actionsMaps['/' + baseDir + a] = that.configs.APP_PATH + routeDir + '/' + controller;
          renderLog("path: %s, controller: %s", '/' + baseDir + a, that.configs.APP_PATH + routeDir + '/' + controller);
        }
        else {
          let actions = fs.readdirSync(that.configs.APP_PATH + routeDir + '/' + controller);
    			actions.forEach((action, index, arr) => {
    				let stats = fs.statSync(that.configs.APP_PATH + routeDir + '/' + controller + '/' + action)
    				if(stats.isFile()) {
    					let a = action.slice(0, -3);
    					a = a == 'index'? '': a;
    					let baseDir = routeDir.slice(0,1);
    					actionsMaps[ baseDir + controller + '/' + a ] = that.configs.APP_PATH + '/controller/' + controller + '/' + action;
              renderLog("path: %s, controller: %s", baseDir + controller + '/' + a, that.configs.APP_PATH + '/controller/' + controller + '/' + action);
    				} else {
    					render(routeDir + '/' + controller + '/' + action);
    				}
    			})
        }
  		})
  	}
  	render(this.configs.routeDir);
  	return actionsMaps;
  }

  /**
   * 生成路由
   */
  generate() {
  	let actionsMap = this.getActionsMap();

  	// 自动加载路由（二级路由）
  	for (var action in actionsMap) {
  		if (actionsMap.hasOwnProperty(action)) {
        let actionHandle = require(actionsMap[action]);
        // method get
        if(actionHandle.get) {
          routeLog('method: %s, path: %s', 'post', action);
          router.get(action, actionHandle.get);
        }
        // method post
  			if(actionHandle.post) {
          routeLog('method: %s, path: %s', 'post', action);
          router.post(action, actionHandle.post);
        }

  		}
  	}
  	return router;
  }

}
module.exports = Generate;
