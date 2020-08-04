import {
	generateCustomElementName,
	generateFilePathRegExp,
	extractFilePathInfo
} from './core-utils.js';

/** @readonly */
const STACK_TRACE_REG_EXP = new RegExp(`(?<=${location.origin}).*`, 'g');

/** @readonly */
const JS_TS_REG_EXP = generateFilePathRegExp(['js', 'ts']);

/**
 * Fetches custom element's template.
 *
 * @param {string} path Absolute path to HTML file with single template element.
 * @returns {Promise<DocumentFragment> | Promise<null>} Content of the template
 * element.
 */
export async function fetchTemplate(path) {
	try {
		const response = await fetch(path);
		const text = await response.text();

		const document = new DOMParser().parseFromString(text, 'text/html');
		const template = document.querySelector('template');

		return template.content.cloneNode(true);

	} catch (error) {
		console.error(error, path);
		return null;
	}
}

/**
 * Attaches shadow root to the custom element.
 *
 * @param {HTMLElement} element Custom element that shadow root is being
 * attached to.
 * @param {HTMLTemplateElement} template Template of the custom element.
 * @returns {ShadowRoot} Shadow root that has been attached to the custom
 * element.
 */
export function attachShadowRoot(element, template) {
	const shadowRoot = element.attachShadow({ mode: 'open' });
	shadowRoot.appendChild(template);

	return shadowRoot;
}

/**
 * Fetches custom element's template and attaches shadow root to it.
 *
 * @param {HTMLElement} element Custom element that shadow root is being
 * attached to.
 * @param {string} path Absolute path to element's template file.
 * @returns {Promise<ShadowRoot>} Shadow root that has been attached to the
 * custom element.
 */
export async function initCustomElement(element, path) {
	const template = await fetchTemplate(path);
	return attachShadowRoot(element, template);
}

/**
 * @typedef {object} CustomElementEntry
 * @property {CustomElementConstructor} constructor Constructor of the custom element.
 * @property {string} [name] Name of the custom element. If not specified, it is generated
 * from constructor's class name, where capital letters are replaced by lower case letters and
 * separated by `-` symbol (*i.e., kebab-case*). E.g., name for a custom element with
 * `MyCustomElement` class name would be generated as `my-custom-element`; custom element with
 * `ABBRElement` class name would receive `abbr-element` generated name.
 * @property {ElementDefinitionOptions} [options] Definition options for the
 * custom element.
 */

/** @param {CustomElementEntry | CustomElementConstructor} element */
export function registerCustomElement(element) {
	let name, constructor, options;

	if (typeof element === 'function') {
		name = generateCustomElementName(element);
		constructor = element,
		options = {};
	} else {
		name = element.name || generateCustomElementName(element.constructor);
		constructor = element.constructor;
		options = element.options || {};
	}

	customElements.define(name, constructor, options);
}

/** @param {CustomElementConstructor[] | CustomElementConstructor[]} elements */
export function registerCustomElements(elements) {
	elements.forEach(registerCustomElement);
}

/**
 * @typedef {object} FilePathInfo Contains information about the current file path.
 * @property {string} fullPath Absolute path to the current file.
 * @property {string} fullPathNoExtension Absolute path to the current file without
 * file extension.
 * @property {string} directoryPath Absolute path to the current directory.
 * @property {string} fileName Name of the current file, no extension.
 * @property {string} fileExtension Extension of the current file.
 */
/**
 * Gets information about the current file path. Idea comes from this stackoverflow post:
 * @see https://stackoverflow.com/a/19807441;
 *
 * Uses error's stack trace to extract file path information.
 *
 * @param {string} fileName
 * @returns {FilePathInfo} Object that contains information about the current file path;
 */
export function getCurrentFilePathInfo(fileName) {
	const error = new Error();
	const matches = error.stack.match(STACK_TRACE_REG_EXP);

	return matches.map(entry => extractFilePathInfo(entry, JS_TS_REG_EXP))
		.find(pathInfo => pathInfo.fileName === fileName);
}

/**
 * Custom Element base class. Fetches element's template and attaches `shadowRoot` to it.
 * If no template path is specified, sets current file's directory as the template path.
 *
 * @abstract
 */
export class CustomElement extends HTMLElement {
	/** @type {ShadowRoot} */
	_shadowRoot;

	/** @type {FilePathInfo} */
	_filePathInfo;

	/** @param {string} [templatePath] Absolute path to the template. */
	constructor(templatePath) {
		super();

		this._filePathInfo = getCurrentFilePathInfo(this.nodeName.toLowerCase());
		let path = templatePath || `${this._filePathInfo.fullPathNoExtension}.html`;

		initCustomElement(this, path)
			.then(shadowRoot => {
				this._shadowRoot = shadowRoot;
				this.init();
			});
	}

	/**
	 * Initiliazises custom element's logic. Called after template fetching.
	 * @abstract
	 */
	init() {
		throw new Error('Must be implemented by subclass!');
	}

	get filePathInfo() {
		return this._filePathInfo;
	}

	get shadowRoot() {
		return this._shadowRoot;
	}
}
