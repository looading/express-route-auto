const { Action } = require('../../../index');

class Index extends Action {
  constructor() {
    super();

  }
  _post(req, res, next) {
    res.send('this is list ::post!');
  }
	_get(req, res, next) {
		res.send('this is list ::get!');
	}
}

module.exports = new Index();
