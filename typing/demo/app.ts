import  * as express from "express";
import * as util from "util";
import { Generate } from "../";


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
  props: {
    Name: 'looading'
  }
});
// let routes = generate()
app.use(generate.init());

app.listen(port, () => {
  console.info("http://localhost:" + port);
})
