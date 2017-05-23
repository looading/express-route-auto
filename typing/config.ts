const log = require('debug')('express-route-auto:props');


let store = {
	props: class {}
}

export const Config = {
	add(props) {
		log('add props %s', props);
		class Props  {
			constructor() {
				Object.keys(props).map(key => {
					this[key] = props[key]
				})
			}
		}
		store.props = Props
		return props;
	},
	get() {
		log('get config %s', store['props']);
		return store['props'];
	},
};
