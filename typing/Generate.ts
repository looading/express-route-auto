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

interface ControllerLevel {
  [id: number]: ControllerOrDir[]
}
interface ControllerOrDir {
  [router: string]: string | any
}

// 获取 routePath => file map
export const getModulesMap: (filePath: string, parentPath: string) => ControllerLevel[] | any  = (filePath, parentPath) => {
  if(fs.statSync(filePath).isDirectory()) {
    let files = fs
      .readdirSync(filePath)
      .map(item => fs
          .statSync(path.join(filePath, item))
          .isDirectory()?
          (getModulesMap(path.join(filePath, item), path.join(parentPath, item)).length? 
            ({ key : path.join(parentPath, item), value: getModulesMap(path.join(filePath, item), path.join(parentPath, item)) }) 
            : undefined)
          : ({ key: path.join(parentPath, (item === 'index.js' ? '/': item.split('.')[0])), value: path.join(filePath, item) }))
      .filter(val => val!== undefined)
    // sort route array
    files.sort((a, b) => {
      let aArr = a.key.split('/')
      let bArr = b.key.split('/')
      if(aArr.length < bArr.length) {
        return 1;
      } 
      if(aArr.length > bArr.length) {
        return -1;
      } 
      if(aArr.length == bArr.length) {
        return aArr[aArr.length-1].length > bArr[bArr.length-1].length ? 1 : -1
      } 
    })
    return files
  } else {
    return undefined
  }
}

// 将 getModulesMap 转化为一维结构
export const formatMap  = (modulesMap) => {
  return modulesMap
    .map(item => {
      return {
        key: item.key,
        value: _.isString(item.value)? item.value : formatMap(item.value)
      }
    })
    .reduce((pre, now) => {
      return  _.isString(now.value) ? [].concat(pre, now) : [].concat(pre, now.value)
    })
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
  	for (let controller of actionsMap) {
      let action = controller.key
      let actionModule = controller.value
        let actionHandle = require(actionModule);
        mapLog('pathname: %s, file: %s, Function: %s', action, actionsMap[action], util.inspect(actionHandle._post))
        // 修复window 路径问题 --> express 会是识别为正则表达式
        action = action.split("\\").join("/");
        // add parmas
        action = action.match(/\/$/g) ? action : [action, '/'].join('');
        ["all", "get", "post", "head", "put", "delete"].map(method => {
          if(actionHandle[method]) {
            if( actionHandle.params && actionHandle.params[method]) {
                action = [action, ':', actionHandle.params[method].join('/:')].join('')
            }
            routeLog('method: %s, path: %s', 'delete', action);            
            /**
             * actionHandle[method] is Array  ==> there are some middleware function in Array
             */
            if(actionHandle[method] instanceof Array) {
              router[method](action, ...actionHandle[method])
            } else {
              router[method](action, actionHandle[method])
            }
            routeLog('Load --> %s :: %s', method, action)
          }
        })
  	}
  	return router;
  }

}

