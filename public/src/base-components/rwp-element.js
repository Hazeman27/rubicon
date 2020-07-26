import { CustomElement } from '../core/core.js';
import { calcColorDifference } from './rwp-colors.js';

/**
 * Base RWP element.
 */
class RWPElement extends CustomElement {
	/** @override */
	init() {
		this.firstElement = this.shadowRoot.children[0];
		this.setColorBasedOnBackground();
	}

	/**
	 * If attribute is present maps its value to style property.
	 *
	 * @param {string} attributeName
	 * @param {string} [styleProperty]
	 * @returns {string | null} Attribute value
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
		if (!this.setStyleFromAttribute('bg-color', 'background-color') &&
			!this.firstElement.style.backgroundColor
		) {
			return;
		}

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
