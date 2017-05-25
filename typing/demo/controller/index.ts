import { Action } from "../../";

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
    if( typeof Number(id) !== 'number') next();
		res.json({
      id,
      text: 'this index page'
    })
	}
  delete = (req, res, next) => {
    res.send('this is delete')
  }
}

module.exports = new Index();
