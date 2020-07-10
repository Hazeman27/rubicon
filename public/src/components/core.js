/**
 * Fetches custom element's template.
 *
 * @param {string} path absolute path to HTML file with single template element.
 * @returns {Promise<DocumentFragment> | Promise<null>} content of the template
 * element.
 */
export async function fetchTemplate(path) {
	try {
		const resoponse = await fetch(path);
		const text = await resoponse.text();

		const document = new DOMParser().parseFromString(text, 'text/html');
		const template = document.querySelector('template');

		return template.content.cloneNode(true);

	} catch (error) {
		console.log(error);
		return null;
	}
}

/**
 * Attaches shadow root to the custom element.
 *
 * @param {HTMLElement} element custom element that shadow root is being
 * attached to.
 * @param {HTMLTemplateElement} template template of the custom element.
 * @returns {ShadowRoot} shadow root that has been attached to the custom
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
 * @param {HTMLElement} element custom element that shadow root is being
 * attached to.
 * @param {string} templatePath absolute path to HTML file with single template
 * element.
 * @returns {Promise<ShadowRoot>} shadow root that has been attached to the
 * custom element.
 */
export async function initCustomElement(element, templatePath) {
	const template = await fetchTemplate(templatePath);
	return attachShadowRoot(element, template);
}

/**
 * @typedef {object} CustomElementEntry
 * @property {string} name name of the custom element.
 * @property {CustomElementConstructor} constructor constructor of the
 * custom element.
 * @property {ElementDefinitionOptions} options definition options for the
 * custom element.
 */

/**
 * Registers single custom element.
 *
 * @param {CustomElementEntry} element object that contains name, constructor,
 * and definition options of the custom element.
 */
export function registerCustomElement({ name, constructor, options = {} }) {
	customElements.define(name, constructor, options);
}

/**
 * @param {CustomElementEntry[]} elements array of objects where each object
 * contains name, constructor, and definition options of the custom element.
 */
export function registerCustomElements(elements) {
	elements.forEach(registerCustomElement);
	getCurrentFilePathInfo();
}

/** @readonly */
const STACK_TRACE_REG_EXP = new RegExp(`(?<=${location.origin}).*`, 'g');

/** @readonly */
const FILE_PATH_REG_EXP = new RegExp('(.*/)(.+)(?=(.js|.ts))');

/**
 * @typedef {object} FilePathInfo contains information about the current file path.
 * @property {string} fullPath absolute path to the current file.
 * @property {string} fullPathNoExtension absolute path to the current file without
 * file extension.
 * @property {string} directoryPath absolute path to the current directory.
 * @property {string} fileName name of the current file, no extension.
 * @property {string} fileExtension extension of the current file.
 */
/**
 * Gets information about the current file path. Idea comes from this stackoverflow post:
 * @see https://stackoverflow.com/a/19807441;
 *
 * Uses error's stack trace to extract file path information.
 *
 * @returns {FilePathInfo} object that contains information about the current file path;
 */
export function getCurrentFilePathInfo() {
	const error = new Error();
	const match = error.stack.match(STACK_TRACE_REG_EXP);

	const filePathInfos = match.map(entry => {
		const [
			fullPathNoExtension,
			directoryPath,
			fileName,
			fileExtension
		] = entry.match(FILE_PATH_REG_EXP);

		return {
			fullPath: `${fullPathNoExtension}${fileExtension}`,
			fullPathNoExtension,
			directoryPath,
			fileName,
			fileExtension
		};
	}).filter((pathInfo, index, array) => (
		!array.slice(index + 1).find(entry => entry.fileName === pathInfo.fileName)
	));

	return filePathInfos[1];
}

/**
 * Custom Element base class. Fetches element's template and attaches `shadowRoot` to it.
 * If no template path is specified, sets current file's directory as the template path.
 */
export class CustomElement extends HTMLElement {
	/** @type {FilePathInfo} */
	filePathInfo = getCurrentFilePathInfo();

	/** @type {ShadowRoot} */
	shadowRoot;

	/** @param {string} templatePath absolute path to the template. */
	constructor(templatePath) {
		super();

		if (!templatePath)
			templatePath = `${this.filePathInfo.fullPathNoExtension}.html`;

		initCustomElement(this, templatePath)
			.then(shadowRoot => {
				this.shadowRoot = shadowRoot;
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
}
