/**
 * Fetches custom element's template.
 *
 * @param {string} path absolute path to HTML file with single template element.
 * @returns {DocumentFragment | null} content of the template element.
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
 * Attaches shadow root to custom element.
 *
 * @param {HTMLElement} element custom element that shadow root is being attached to.
 * @param {HTMLTemplateElement} template template of the custom element.
 * @returns {ShadowRoot} shadow root that has been attached to custom element.
 */
export function attachShadowRoot(element, template) {
	const shadowRoot = element.attachShadow({ mode: 'open' });
	shadowRoot.appendChild(template);

	return shadowRoot;
}

/**
 * @typedef CustomElement
 * @type {object}
 * @property {string} name name of the custom element.
 * @property {CustomElementConstructor} constructor constructor of the custom element.
 * @property {ElementDefinitionOptions} options definition options for the custom element.
 */

/**
 * Registers single custom element.
 *
 * @param {CustomElement} element object that contains name, constructor,
 * and definition options of the custom element.
 */
export function registerCustomElement({ name, constructor, options = {} }) {
	customElements.define(name, constructor, options);
}

/**
 * @param {CustomElement[]} elements array of objects where each object
 * contains name, constructor, and definition options of the custom element.
 */
export function registerCustomElements(elements) {
	elements.forEach(registerCustomElement);
}