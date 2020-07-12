import RWPElement from '../rwp/rwp.js';

class RWPBreadcrumbs extends RWPElement {
	/** @type {HTMLElement} */
	_container;

	constructor() {
		super('rwp-breadcrumbs');
	}

	/** @override */
	init() {
		super.init();
		this._container = this.shadowRoot.querySelector('#breadcrumbs');
		this._container.innerHTML = location.pathname;
	}
	// attributeChangedCallback()
}

export default RWPBreadcrumbs;
