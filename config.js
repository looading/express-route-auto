const log = require('debug')('express-route-auto:config');

let store = {}

module.exports = {
	add(config) {
		log('add config %s', config);
		store['config'] = config;
		return config;
	},
	get() {
		log('get config %s', store['config']);
		return store['config'];
	}
};
