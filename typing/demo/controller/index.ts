import { Action } from "../../";

class Index extends Action {
  constructor() {
    super();
  }
  post = (req, res, next) => {
    res.send('this is / ::post!');
  }
	get = (req, res, next) => {
		res.send('this is / ::get!');
	}
  delete = (req, res, next) => {
    res.send('this is delete')
  }
}

module.exports = new Index();
