const fs = require('fs');
const express = require('express');
const util = require('util');
const config = require('../config');


let router = express.Router();

class Generate {
  constructor() {
    this.config = config;
    this.generate = this.generate.bind(this)
    return this.generate;
  }
  /**
   * 获取controller name
   */
  getModules(routeDir) {
  	let dirs = fs.readdirSync(this.config.APP_PATH + routeDir);
  	let controllers = []

  	// 获取controller
  	dirs.forEach((val, index, arr) => {
  		let stats = fs.statSync(this.config.APP_PATH + routeDir + '/' + val);
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
        let stats = fs.statSync(that.config.APP_PATH + routeDir + '/' + controller)

        if(stats.isFile()) {
          let a = controller == 'index.js' ? '' : controller;
          let baseDir = routeDir.slice(12);
          actionsMaps['/' + baseDir + a] = that.config.APP_PATH + routeDir + '/' + controller
        }
        else {
          let actions = fs.readdirSync(that.config.APP_PATH + routeDir + '/' + controller);
    			actions.forEach((action, index, arr) => {
    				let stats = fs.statSync(that.config.APP_PATH + routeDir + '/' + controller + '/' + action)
    				if(stats.isFile()) {
    					let a = action.slice(0, -3);
    					a = a == 'index'? '': a;
    					let baseDir = routeDir.slice(0,1);
    					actionsMaps[ baseDir + controller + '/' + a ] = that.config.APP_PATH + '/controller/' + controller + '/' + action;
    				} else {
    					render(routeDir + '/' + controller + '/' + action);
    				}
    			})
        }

  		})
  	}

  	render(this.config.routeDir);
  	return actionsMaps;
  }

  /**
   * 生成路由
   */
  generate(req, res, next) {
  	let actionsMap = this.getActionsMap();


  	// 自动加载路由（二级路由）
  	for (var action in actionsMap) {
  		if (actionsMap.hasOwnProperty(action)) {
  			router.post(action, require(actionsMap[action]));
  		}
  	}
  	return router;
  }

}
module.exports = Generate;
