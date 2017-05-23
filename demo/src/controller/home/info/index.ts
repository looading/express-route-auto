import { Action } from "../../../../../typing";

class Index extends Action {
  constructor() {
    super();
  }
  _post(req, res, next) {
    res.send('this is / ::post!');
  }
	_get(req, res, next) {
		res.send('this is / ::get!');
	}
}

module.exports = new Index();
