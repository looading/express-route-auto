const { Action } = require('../../index');

class Index extends Action {
  constructor() {
    super();
  }
  // _post(req, res, next) {
  //   res.send('this is / ::post!');
  // }
	_get(req, res, next) {
		res.send('this is / ::get!');
	}
  _delete(req, res, next) {
    res.send('this is delete')
  }
}

module.exports = new Index();
