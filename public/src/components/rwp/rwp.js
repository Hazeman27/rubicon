import { CustomElement } from './core.js';
import { calcColorDifference } from './colors.js';

/**
 * Base RWP element.
 */
class RWPElement extends CustomElement {
	/** @override */
	init() {
		this.firstElement = this._shadowRoot.children[0];
		this.setColorBasedOnBackground();
	}

	/** @override */
	tagName() {
		return this.constructor.name.toLowerCase().split(/(?<=rwp)/).join('-');
	}

	/**
	 * If attribute is present maps its value to style property.
	 *
	 * @param {string} attributeName
	 * @param {string} [styleProperty]
	 * @returns {string | null} attribute value
	 */
	setStyleFromAttribute(attributeName, styleProperty) {
		if (!styleProperty) {
			styleProperty = attributeName;
		}

		const attribute = this.attributes.getNamedItem(attributeName);

		if (attribute) {
			this.firstElement.style[styleProperty] = attribute.value;
			return attribute.value;
		}

		return null;
	}

	/**
	 * Sets element's text color based on contrast with its background color.
	 */
	setColorBasedOnBackground() {
		if (!this.setStyleFromAttribute('bg-color', 'background-color'))
			return;

		const colorDifference = calcColorDifference(
			'white', this.firstElement.style.backgroundColor
		);

		if (colorDifference.isGood) {
			this.firstElement.style.color = 'white';
		} else {
			this.firstElement.style.color = 'black';
		}
	}
}

export default RWPElement;
