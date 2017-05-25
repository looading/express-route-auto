import { Action, Params } from "../../../";

class List extends Action {
  params: Params = {
    get: ['id']
  }
  constructor() {
    super();
  }
  post = (req, res, next) => {
    res.send('this is list ::post!');
  }
  get = [
    (req, res, next) => {
      console.log(`some want get test list : ${ req.params.id }`)
      next()
    },
    (req, res, next) => {
      res.json({
        'list-id': req.params.id
      })
    }
  ]
}

module.exports = new List();
