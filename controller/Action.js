const config = require('../config');

class Action {
  constructor(res, req, next) {
    for (var variable in config) {
      if (config.hasOwnProperty(variable)) {
        this[variable] = config[variable];
      }
    }

    this.run = this.run.bind(this);
  }
}


module.exports = Action
