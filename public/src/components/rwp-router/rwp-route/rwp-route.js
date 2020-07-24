import { fetchTemplate } from '../../../core/core.js';
import RWPElement from '../../rwp-element.js';
// eslint-disable-next-line no-unused-vars
import RWPRouter from '../rwp-router.js';

class RWPRoute extends RWPElement {
	/** @readonly */
	static WORD_REG_EXP_STRING = '[\\w0-9-_]+';

	/** @readonly */
	static PARAMS_REG_EXP = new RegExp(
		`(?<=/:)(${RWPRoute.WORD_REG_EXP_STRING})(?=/)?`, 'g'
	);

	/** @type {boolean} */
	_default;

	/** @type {Path} */
	_path;

	/** @type {RWPRouter} */
	_router;

	/** @type {string} */
	_viewsPath;

	/** @type {string} */
	_viewPath;

	/** @type {DocumentFragment} */
	_view;

	/** @type {HTMLSlotElement} */
	_root;

	/** @override */
	async init() {
		super.init();

		this._root = this.shadowRoot.querySelector('slot');
		this._router = this.parentElement;

		if (this._router.nodeName.toLowerCase() !== 'rwp-router')
			throw Error('Route must be inside router element!');

		const ambiguous = this.hasAttribute('ambiguous');
		this._default = this.hasAttribute('default');

		this._path = RWPRoute.parsePath(this.getAttribute('path'), ambiguous, this._default);
		this._view = await this.getView();

		this._router.addRoute(this);
	}

	/** @returns {Promise<DocumentFragment>} */
	async getView() {
		const viewPathAttr = this.getAttribute('view');

		if (!viewPathAttr && !this._root.assignedElements().length > 0)
			throw Error('Route must include view attribute or child elements!');

		if (viewPathAttr) {
			this._viewsPath = this._router.getAttribute('views-path');

			if (this._viewsPath) {
				this._viewPath = `${this._viewsPath.trim()}${
					RWPRoute.includesLeadingSlash(this._viewsPath) ? '' : '/'
				}${viewPathAttr}`;
			} else {
				this._viewPath = viewPathAttr;
			}

			return fetchTemplate(this._viewPath);
		}

		const fragment = new DocumentFragment();

		this._root.assignedElements().forEach(element => {
			fragment.appendChild(element.cloneNode(true));
			element.remove();
		});

		return fragment;
	}

	attributeChangedCallback(name, _oldValue, newValue) {
		if (name !== 'current')
			return;

		if (newValue === 'true') {
			this.clearRootContent();
			this.setRootContent();
		} else {
			this.clearRootContent();
		}
	}

	setViewParams() {
		const currentParams = location.pathname.match(this._path.regex);
		const pathnameSlot = this._view.querySelector('slot[name="pathname"]');

		if (currentParams) {
			this._path.params.forEach((param, index) => {
				const slot = this._view.querySelector(`slot[name="${param}"]`);

				if (slot)
					slot.textContent = currentParams[index + 1];
			});
		}

		if (pathnameSlot) {
			pathnameSlot.textContent =
				location.pathname === '/' ?
					'root' : location.pathname;
		}
	}

	setRootContent() {
		this.setViewParams();
		this._root.appendChild(this._view.cloneNode(true));
	}

	clearRootContent() {
		this._root.innerHTML = '';
	}

	get default() {
		return this._default;
	}

	get path() {
		return this._path;
	}

	get viewPath() {
		return this._viewPath;
	}

	static get observedAttributes() {
		return ['current'];
	}

	/**
	 * @typedef {object} Path
	 * @property {string} href Original path string.
	 * @property {RegExp} regex Regular expression that matches the path.
	 * @property {string[]} params Array of path parameters.
	 */

	/**
	 * @param {string} path
	 * @param {boolean} ambiguous
	 * @param {boolean} isDefault
	 * @returns {Path}
	 */
	static parsePath(path, ambiguous, isDefault) {

		if (isDefault) {
			return {
				href: null,
				/**
				 * Regex that does not match anything.
				 * Reasoning: to avoid checking if `path.regex === null`,
				 */
				regex: new RegExp('$.'),
				params: null,
			};
		}

		if (!path)
			throw Error('Route must include `path` attribute!');

		const trimmedPath = path.trim();
		const params = trimmedPath.match(RWPRoute.PARAMS_REG_EXP);

		const lead = ambiguous ? '' : '^';
		const tail = ambiguous ? '' : '$';

		if (!params) {
			return {
				href: trimmedPath,
				regex: new RegExp(`${lead}${trimmedPath}${tail}`),
				params: []
			};
		}

		const paramsRegExp = new RegExp(
			params.map(param => `:${param}`).join('|'), 'g'
		);

		const pathRegExp = new RegExp(
			`${lead}${trimmedPath.replace(
				paramsRegExp,
				`(${RWPRoute.WORD_REG_EXP_STRING})`
			)}${tail}`
		);

		return {
			href: trimmedPath,
			regex: pathRegExp,
			params: params.map(param => param.replace('-', ''))
		};
	}

	/**
	 * @param {string} path
	 * @returns {boolean}
	 */
	static includesLeadingSlash(path) {
		return path.charAt(path.length - 1) === '/';
	}
}

export default RWPRoute;
