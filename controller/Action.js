const Config = require('../config');
class Action {
  constructor() {
    let configs = Config.get();
    for (var variable in configs) {
      if (configs.hasOwnProperty(variable)) {
        this[variable] = configs[variable];
      }
    }
    
    if(this._post) {
      this._post = this._post.bind(this);
    }
    if(this._get) {
      this._get = this._get.bind(this);
    }
    if(this._delete) {
      this._delete = this._delete.bind(this);
    }
    if(this._put) {
      this._put = this._put.bind(this);
    }
  }
}


module.exports = Action;
