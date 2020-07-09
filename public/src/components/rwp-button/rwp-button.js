import { initCustomElement } from '../echo.js';
import { calcColorDifference } from './colors.js';

class RWPButton extends HTMLElement {
	/** @type {HTMLButtonElement} */
	_button;

	constructor() {
		super();
		initCustomElement(this, '/src/components/rwp-button/rwp-button.html')
			.then(shadowRoot => {
				this._button = shadowRoot.querySelector('button');

				this.setStyleFromAttribute('bg-color', 'background-color');
				this.setColorBasedOnBackground();
			});
	}

	/**
	 * If attribute is present maps its value to style property.
	 *
	 * @param {string} attributeName
	 * @param {string} [styleProperty]
	 */
	setStyleFromAttribute(attributeName, styleProperty) {
		if (!styleProperty) {
			styleProperty = attributeName;
		}

		const attribute = this.attributes.getNamedItem(attributeName);

		if (attribute) {
			this._button.style[styleProperty] = attribute.value;
		}
	}

	/**
	 * Sets button's text color based on contrast with its background color.
	 */
	setColorBasedOnBackground() {
		if (calcColorDifference('white', this._button.style.backgroundColor).isGood) {
			this._button.style.color = 'white';
		} else {
			this._button.style.color = 'black';
		}
	}
}

export default RWPButton;
