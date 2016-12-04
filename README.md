[![Build Status](https://travis-ci.org/looading/express-route-auto.svg?branch=master)](https://travis-ci.org/looading/express-route-auto)
[![npm](https://img.shields.io/npm/v/express-route-auto.svg?maxAge=2592000)](https://www.npmjs.com/package/express-route-auto)
[![npm](https://img.shields.io/npm/dm/express-route-auto.svg?maxAge=2592000)](https://www.npmjs.com/package/express-route-auto)


## express-route-auto
用于express路由的自动加载(目前支持post,get)

初步想法是为了便于 后端服务的开发

## install

```js
npm install express-route-auto --save
```

## config
```js
module.exports = {
  // routeDir 是必须的， 是controller的文件地址（相对于根目录））
  routeDir: '/controller',
  // APP_PATH 也是必须的，是模块获取到根目录路径
  APP_PATH: __dirname
}

```


## setup
```js
// 使配置公共化
const express = require('express');

const { config, Generate } = require('../index');

const conf = require('./conf');

const port = 3000;

// 初始化配置项
config.add(conf);

let app = express();

// Generate 必须在配置完成后实例化
let generate = new Generate();
app.use(generate());



app.listen(port, () => {
  console.info(`server is running on port: ${port}`);
})
// 生成路由并使用
let routes = generate()
app.use(routes);
```

## 编写路由
```js
const { Action } = require('express-route-auto');

class Index extends Action{
  constructor() {
    super();
  }
	// 处理post 请求
  _post(req, res, next) {
    res.send('this is post!');
  }
	// 处理get 请求
	_get(req, res, next) {
		res.send('this is get!');
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
详细的可以查看demo文件里的代码
由于是基于自己项目的，目前还没有扩展开来。

### feature
后续添加中
