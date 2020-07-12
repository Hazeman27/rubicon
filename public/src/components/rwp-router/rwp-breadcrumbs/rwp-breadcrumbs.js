import RWPElement from '../../rwp/rwp.js';
import RWPRoute from '../rwp-route/rwp-route.js';

class RWPBreadcrumbs extends RWPElement {
	/** @readonly */
	static LOCATION_PORTIONS_REG_EXP = new RegExp(
		`(?<=/)${RWPRoute.WORD_REG_EXP_STRING}`, 'g'
	);

	/** @type {HTMLElement} */
	_container;

	constructor() {
		super('rwp-breadcrumbs');
	}

	/** @override */
	init() {
		super.init();
		this._container = this._shadowRoot.querySelector('#breadcrumbs');

		const portions = location.pathname.match(
			RWPBreadcrumbs.LOCATION_PORTIONS_REG_EXP
		);

		if (portions) {
			portions.forEach((portion, index, portions) => {
				const link = document.createElement('a');

				link.className = 'breadcrumb';
				link.textContent = portion;
				link.href = `/${portions.slice(0, index + 1).join('/')}`;

				this._container.appendChild(link);
			});
		}
	}
}

export default RWPBreadcrumbs;
