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
 * @param {string} path Absolute path to HTML file with single template element.
 * @returns {Promise<DocumentFragment> | Promise<null>} Content of the template element.
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
 * @param {HTMLElement} element
 * @param {HTMLTemplateElement} template
 * @returns {ShadowRoot}
 */
export function attachShadowRoot(element, template) {
	const shadowRoot = element.attachShadow({ mode: 'open' });
	shadowRoot.appendChild(template);

	return shadowRoot;
}

/**
 * Fetches custom element's template and attaches shadow root.
 *
 * @param {HTMLElement} element
 * @param {string} path Absolute path to the element's template file.
 * @returns {Promise<ShadowRoot>}
 */
export async function initCustomElement(element, path) {
	const template = await fetchTemplate(path);
	return attachShadowRoot(element, template);
}

/**
 * @typedef {object} CustomElementEntry
 * @property {CustomElementConstructor} constructor
 * @property {string} [name] Name of the custom element. If not specified, it is generated from constructor's class name, where capital letters are replaced by lower case letters and separated by `-` symbol (*i.e., kebab-case*). E.g., name for a custom element with `MyCustomElement` class name would be generated as `my-custom-element`; custom element with `ABBRElement` class name would receive `abbr-element` generated name.
 * @property {ElementDefinitionOptions} [options] Definition options for the custom element.
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
 * @typedef {object} FilePathInfo
 * @property {string} fullPath
 * @property {string} fullPathNoExtension
 * @property {string} directoryPath
 * @property {string} fileName
 * @property {string} fileExtension
 */

/**
 * Gets information about the current file path. Idea comes from this stackoverflow post:
 * @see https://stackoverflow.com/a/19807441;
 *
 * Uses error's stack trace to extract file path information.
 *
 * @param {string} fileName
 * @returns {FilePathInfo}
 */
export function getCurrentFilePathInfo(fileName) {
	const error = new Error();
	const matches = error.stack.match(STACK_TRACE_REG_EXP);

	return matches.map(entry => extractFilePathInfo(entry, JS_TS_REG_EXP))
		.find(pathInfo => pathInfo.fileName === fileName);
}

/**
 * Custom Element base class. Fetches element's template and attaches `shadowRoot`.
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
