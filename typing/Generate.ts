import * as fs from "fs";
import * as express from "express";
import * as util from "util";
import { Config } from "./config";
import * as debug from "debug";
import * as _ from "lodash";
import * as path from "path";
let routeLog = debug('express-route-auto:route');
let renderLog = debug('express-route-auto:render');
let confLog = debug('express-route-auto:configs');
let mapLog = debug('express-route-auto:map')
let errLog = debug('express-route-auto:error')
let router = express.Router();

// 获取 routePath => file map
export function getModulesMap (filePath, parentPath) {
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
export function formatMap (modulesMap) {
  return modulesMap
    .map(item => {
      let key = Object.keys(item)
      return key
        .map(val => _.isString(item[val])? item : formatMap(item[val]))
        .reduce((pre, now) => Object.assign(pre, now))
    })
    .reduce((pre, now) => Object.assign(pre, now))
}

export class Generate {
  private configs: {
    APP_PATH: string;
    routeDir: string;
    props: any[]
  };
  constructor(configs) {
    Config.add(configs.props)
    this.configs = configs
  }
  /**
   * 生成路由
   */
  init = () => {
  	let actionsMap = getModulesMap(path.join(this.configs.APP_PATH, this.configs.routeDir), '/');
    actionsMap = formatMap(actionsMap)

  	// 自动加载路由
  	for (var action in actionsMap) {
  		if (actionsMap.hasOwnProperty(action)) {
        let actionHandle = require(actionsMap[action]);
        mapLog('pathname: %s, file: %s, Function: %s', action, actionsMap[action], util.inspect(actionHandle._post))
        // 修复window 路径问题 --> express 会是识别为正则表达式
        action = action.split("\\").join("/");

        ["all", "get", "post", "head", "put", "delete"].map(method => {
          if(actionHandle[method]) {
            routeLog('method: %s, path: %s', 'delete', action);

            /**
             * actionHandle[method] is Array  ==> there are some middleware function in Array
             */
            if(actionHandle[method] instanceof Array) {
              router[method](action, ...actionHandle[method])
            } else {
              router[method](action, actionHandle[method])
            }
          }
        })

  		}
  	}
  	return router;
  }

}

