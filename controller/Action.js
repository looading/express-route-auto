const Config = require('../config');
class Action {
  constructor() {
    let configs = Config.get();
    for (var variable in configs) {
      if (configs.hasOwnProperty(variable)) {
        this[variable] = configs[variable];
      }
    }
    this.post = this.post.bind(this);
    this.get = this.get.bind(this);
  }
}


module.exports = Action;
