import { Action } from "../../../";

class Index extends Action {
  constructor() {
    super();

  }
  post = (req, res, next) => {
    res.send('this is list ::post!');
  }
	get = (req, res, next) => {
		res.send('this is list ::get!');
	}
}

module.exports = new Index();
