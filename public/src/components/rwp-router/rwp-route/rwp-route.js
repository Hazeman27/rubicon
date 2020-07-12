import { fetchTemplate } from '../../rwp/core.js';
import RWPElement from '../../rwp/rwp.js';
// eslint-disable-next-line no-unused-vars
import RWPRouter from '../rwp-router.js';

class RWPRoute extends RWPElement {
	/** @readonly */
	static WORD_REG_EXP_STRING = '[\\w0-9-_]+';

	/** @readonly */
	static PARAMS_REG_EXP = new RegExp(
		`(?<=/:)(${RWPRoute.WORD_REG_EXP_STRING})(?=/)?`, 'g'
	);

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

		const viewPathAttr = this.attributes.getNamedItem('view');
		const exact = this.attributes.getNamedItem('exact');

		if (!viewPathAttr) {
			console.error('Route must include view attribute!');
			return null;
		}

		this._path = RWPRoute.parsePath(
			this.attributes.getNamedItem('path'),
			exact ? exact.value === 'true' : true
		);

		this._root = this._shadowRoot.querySelector('slot');

		this._router = this.parentElement;
		this._viewsPath = this._router.attributes.getNamedItem('views-path');

		if (this._viewsPath) {
			this._viewPath = `${this._viewsPath.value.trim()}${
				RWPRoute.includesLeadingSlash(this._viewsPath.value) ? '' : '/'
			}${viewPathAttr.value}`;
		} else {
			this._viewPath = viewPathAttr.value;
		}

		this._view = await fetchTemplate(this._viewPath);

		if (RWPRoute.pathMatchesLocation(this._path)) {

			if (this._path.params)
				this.setViewParams();

			this._root.appendChild(this._view);
		}
	}

	setViewParams() {
		const currentParams = location.pathname.match(this._path.regex);

		this._path.params.forEach((param, index) => {
			const slot = this._view.querySelector(`slot[name="${param}"]`);
			slot.textContent = currentParams[index + 1];
		});
	}

	/**
	 * @param {Path} path
	 * @returns {boolean}
	 */
	static pathMatchesLocation(path) {
		return path.regex.test(location.pathname);
	}

	/**
	 * @typedef {object} Path
	 * @property {string} path Original path string.
	 * @property {RegExp} regex Regular expression that matches the path.
	 * @property {string[]} params Array of path parameters.
	 */

	/**
	 * @param {Attr} path
	 * @param {boolean} exact
	 * @returns {Path}
	 */
	static parsePath(path, exact) {

		if (!path) {
			console.error('Route must include `path` attribute!');
			return null;
		}

		const trimmedPath = path.value.trim();
		const params = trimmedPath.match(RWPRoute.PARAMS_REG_EXP);

		const lead = exact ? '^' : '';
		const tail = exact ? '$' : '';

		if (!params) {
			return {
				path: trimmedPath,
				regex: new RegExp(`${lead}${trimmedPath}${tail}`),
				params: null
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
			path: trimmedPath,
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
