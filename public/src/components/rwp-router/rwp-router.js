import RWPElement from '../rwp/rwp.js';
// eslint-disable-next-line no-unused-vars
import RWPRoute from './rwp-route/rwp-route.js';

class RWPRouter extends RWPElement {
	/** @type {RWPRoute[]} */
	_routes = [];

	/** @type {HTMLSlotElement} */
	_root;

	/** @override */
	init() {
		super.init();

		this._root = this._shadowRoot.querySelector('slot');
		this._routes = this._root.assignedElements();
	}

	get root() {
		return this._root;
	}
}

export default RWPRouter;
