import RWPElement from '../rwp-element.js';
// eslint-disable-next-line no-unused-vars
import RWPRoute from './rwp-route/rwp-route.js';

class RWPRouter extends RWPElement {
	/** @type {RWPRouter} */
	static instance;

	/** @type {RWPRoute[]} */
	_routes = [];

	/** @type {RWPRoute} */
	_defaultRoute;

	/** @type {HTMLSlotElement} */
	_root;

	constructor() {
		super();
		this.handleLinkClick = this.handleLinkClick.bind(this);
	}

	/** @override */
	init() {
		if (RWPRouter.instance)
			throw Error('Only single instance of the router is allowed!');

		super.init();

		this._root = this._shadowRoot.querySelector('slot');
		this._routes = this._root.assignedElements();

		this._defaultRoute = this._routes.find(route => route.hasAttribute('default'));

		document.addEventListener('click', this.handleLinkClick);
		self.addEventListener('popstate', () => this.route());

		RWPRouter.instance = this;
	}

	/**
	 * @param {string} [href=location.pathname]
	 * @returns {RWPRoute} Matching route;
	 */
	route(href = location.pathname) {

		let matchingRoute;

		this._routes.forEach(route => {

			if (route.path.regex && route.path.regex.test(href)) {
				route.setAttribute('current', 'true');
				matchingRoute = route;
			} else {
				route.setAttribute('current', 'false');
			}
		});

		if (!matchingRoute && this._defaultRoute) {
			this._defaultRoute.setAttribute('current', 'true');
			return this._defaultRoute;
		}

		return matchingRoute;
	}

	/** @param {MouseEvent} event */
	handleLinkClick(event) {

		let target;

		if (event.target.tagName === 'A') {
			target = event.target;
		} else if (event.target.shadowRoot) {
			target = RWPRouter.findTargetLink(event);
		}

		if (!target) return;

		const href = target.href.replace(location.origin, '');

		event.preventDefault();
		self.history.pushState({}, href, href);

		this.route(href);
	}

	get root() {
		return this._root;
	}

	/**
	 * Looks for the link element of the event target. Returns link element if
	 * found, `null` otherwise.
	 *
	 * @param {MouseEvent} event
	 * @returns {HTMLLinkElement | null}
	 */
	static findTargetLink(event) {
		/** @type {ShadowRoot} */
		const shadowRoot = event.target.shadowRoot;

		const links = shadowRoot.querySelectorAll('a');

		if (links.length === 0)
			return null;

		const { clientX, clientY } = event;
		let boundingRectangle;

		for (const link of links) {
			boundingRectangle = link.getBoundingClientRect();

			if (clientX > boundingRectangle.left  &&
				clientX < boundingRectangle.right &&
				clientY > boundingRectangle.top   &&
				clientY < boundingRectangle.bottom
			) {
				return link;
			}
		}

		return null;
	}
}

export default RWPRouter;
