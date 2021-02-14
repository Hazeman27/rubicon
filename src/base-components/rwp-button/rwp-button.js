import { initCustomElement } from '../../core/core.js';
import { calcColorDifference } from '../rwp-colors.js';


class RWPButton extends HTMLElement {
  /** @type {HTMLButtonElement} */
  _button;

  constructor() {
    super();

    initCustomElement(this).then(() => {
      this._button = this.shadowRoot.querySelector('button');
      const type = this.getAttribute('type');

      if (type)
        this._button.setAttribute('type', type);

      this.setColorBasedOnBackground();
    });
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
      this._button.style[styleProperty] = attribute.value;
      return attribute.value;
    }

    return null;
  }

  /**
   * Sets element's text color based on contrast with its background color.
   */
  setColorBasedOnBackground() {
    if (!this.setStyleFromAttribute('bg-color', 'background-color') &&
      !this._button.style.backgroundColor
    ) {
      return;
    }

    const colorDifference = calcColorDifference(
      'white', this._button.style.backgroundColor
    );

    if (colorDifference.isGood) {
      this._button.style.setProperty('color', 'white', 'important');
    } else {
      this._button.style.setProperty('color', 'black', 'important');
    }
  }
}

export default RWPButton;