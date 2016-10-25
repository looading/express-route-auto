[![Build Status](https://travis-ci.org/looading/express-route-auto.svg?branch=master)](https://travis-ci.org/looading/express-route-auto)
[![npm](https://img.shields.io/npm/v/express-route-auto.svg?maxAge=2592000)](https://www.npmjs.com/package/express-route-auto)
[![npm](https://img.shields.io/npm/dm/express-route-auto.svg?maxAge=2592000)](https://www.npmjs.com/package/express-route-auto)


## express-route-auto
用于express路由的自动加载(目前支持post)
初步想法是为了便于 后端api服务的开发

## install

```js
npm install express-route-auto --save
```

## setup

```js
// 使配置公共化
let { config } = require('express-route-auto');

let obj = {
	Sequelize,
	DataBase,
	sqlite,
	util,
	http,
	URL,
	querystring,
	fs,
	yaml,
	// routeDir 是必须的， 是controller的文件地址（相对于根目录））
	routeDir: '/controller',
	// APP_PATH 也是必须的，是模块获取到根目录路径
  	APP_PATH: __dirname
}

for (var item in obj) {
	if (obj.hasOwnProperty(item)) {
		config[item] = obj[item]
	}
}

const { generate } = require('express-route-auto');

const app = express();

// 生成路由并使用
app.use(generate())

```

## 编写路由
```js
# /

const { Action } = require('express-route-auto');

class Index extends Action{
  constructor() {
    super();
    return this.run;
  }
  run(req, res, next) {
    res.send('this is index!')
  }
}

module.exports = new Index();

```

## 路由目录结构

```js
- controller
	- user				
		- index.js		=>	/user/
		- show.js			=> /user/show
	- index.js			=> /
```

### continue
按照上述的配置基本就能跑起来了

由于是基于自己项目的，目前还没有扩展开来，

### feature

	- 支持 get 等

	- 支持 /user/:id 

	- 支持 middleware

	- 提供视图