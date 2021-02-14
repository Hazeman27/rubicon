import { initCustomElement } from '../../../core/core.js';
import RWPRoute from '../rwp-route/rwp-route.js';


class RWPBreadcrumbs extends HTMLElement {
  /** @readonly */
  static LOCATION_PORTIONS_REG_EXP = new RegExp(
    `(?<=/)${RWPRoute.WORD_REG_EXP_STRING}`, 'g'
  );

  /** @type {HTMLElement} */
  _container;

  constructor() {
    super();

    initCustomElement(this).then(() => {
      this.setContent = this.setContent.bind(this);
      this._container = this.shadowRoot.querySelector('#breadcrumbs');
      this.setContent();

      self.addEventListener('route', this.setContent);
      self.addEventListener('popstate', this.setContent);
    });
  }

  setContent() {
    this._container.innerHTML = '';

    const portions = location.pathname.match(
      RWPBreadcrumbs.LOCATION_PORTIONS_REG_EXP
    );

    if (portions) {
      portions.forEach((portion, index, portions) => {
        const link = document.createElement('a');

        link.className = 'breadcrumb';
        link.textContent = portion;
        link.href = `/${portions.slice(0, index + 1).join('/')}`;

        this._container.appendChild(link);
      });
    }
  }
}

export default RWPBreadcrumbs;