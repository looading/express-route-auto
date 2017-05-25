[![Build Status](https://travis-ci.org/looading/express-route-auto.svg?branch=master)](https://travis-ci.org/looading/express-route-auto)
[![npm](https://img.shields.io/npm/v/express-route-auto.svg?maxAge=2592000)](https://www.npmjs.com/package/express-route-auto)
[![npm](https://img.shields.io/npm/dm/express-route-auto.svg?maxAge=2592000)](https://www.npmjs.com/package/express-route-auto)


## express-route-auto
用于express路由的自动加载

初步想法是为了便于 后端服务的开发

推荐用Typescript

## install

```bash
npm install express-route-auto --save
```

## setup
``` ts
import  * as express from "express";
import * as util from "util";
import { Generate } from "express-route-auto";


const port = 3000;


let app = express();

app.get('/123/', (req, res, next) => {
  next()
})

let generate = new Generate({
  // routeDir 是必须的， 是controller的文件地址（相对于根目录））
  routeDir: 'controller',
  // APP_PATH 也是必须的，是模块获取到根目录路径
  APP_PATH: __dirname,
  /**
  * 为里每一个Controller增加props 挂载到this上， 比如数据库的Model -> this.User.add(...)
  * props: {
  *   User: Model.User
  * }
  */
  props: {
    Name: 'looading'
  }
});
// let routes = generate()
app.use(generate.init());

app.listen(port, () => {
  console.info(`server is running on port: ${port}`);
})
```

## Controller
```js
import { Action } from "express-route-auto";

class Index extends Action {
  params = {
    get: ['id']
  }
  constructor() {
    super();
  }
  post = (req, res, next) => {
    res.send('this is / ::post!');
  }
	get = (req, res, next) => {
    let { id } = req.params
		res.json({
      id,
      context: 'this is / ::get!'
    });
	}
  delete = (req, res, next) => {
    res.send('this is delete')
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
    - info        // 空目录不会成为路由
    — detail
      - index.js  => /user/detail
	- index.js			=> /
```

### continue
按照上述的配置基本就能跑起来了
详细的可以查看demo文件里的代码
由于是基于自己项目的，目前还没有扩展开来。

### feature

...
