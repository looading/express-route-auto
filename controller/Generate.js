const fs = require('fs');
const express = require('express');
const util = require('util');


let config = require('../../config');

let router = express.Router();

class Generate {
  constructor(config, req, res, next) {
    this.config = config;
    this.req = req;
    this.res = res;
    this.next = next;

    return this.generate(req, res, next);
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
        console.info(controller, 1)
        let stats = fs.statSync(that.config.APP_PATH + routeDir + '/' + controller)

        console.log(routeDir + '/' + controller, 2)
        if(stats.isFile()) {
          console.info(routeDir, 4)
          let a = controller == 'index.js' ? '' : controller;
          let baseDir = routeDir.slice(12);
          console.info(baseDir, 5)
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
    					console.warn(routeDir + '/' + controller + '/' + action, 3)
    					render(routeDir + '/' + controller + '/' + action);
    				}
    			})
        }

  		})
  	}

  	render(this.config.routeDir);
  	console.info(util.inspect(actionsMaps))
  	return actionsMaps;
  }

  /**
   * 生成路由
   */
  generate(req, res, next) {
  	let actionsMap = this.getActionsMap();

  	// 定义首页路由逻辑
  	router.post('/', (req, res, next) => {
  		res.send('This is a api server!');
  	})

  	// 自动加载路由（二级路由）
  	for (var action in actionsMap) {
  		if (actionsMap.hasOwnProperty(action)) {
  			router.post(action, require(this.actionsMap[action]));
  		}
  	}
  	return router;
  }

}
module.exports = Generate;
