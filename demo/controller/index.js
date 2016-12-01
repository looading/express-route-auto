const { Action } = require('../../index');

class Index extends Action {
  constructor() {
    super();
  }
  post(req, res, next) {
    res.send('this is / ::post!');
  }
	get(req, res, next) {
		res.send('this is / ::get!');
	}
}

module.exports = new Index();
