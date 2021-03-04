import { CustomElement } from '../../core/core.js';
import { RWPRoute } from './rwp-route.js';


export class RWPBreadcrumbs extends CustomElement {
  static LOCATION_PORTIONS_REG_EXP = new RegExp(
    `(?<=/)${RWPRoute.WORD_REG_EXP_STRING}`, 'g'
  );

  _container;

  constructor() {
    super(template);

    this.setContent = this.setContent.bind(this);
    this._container = this.shadowRoot?.querySelector('#breadcrumbs');
    this.setContent();

    self.addEventListener('route', this.setContent);
    self.addEventListener('popstate', this.setContent);
  }

  setContent() {
    if (this._container) this._container.innerHTML = '';

    const portions = location.pathname.match(
      RWPBreadcrumbs.LOCATION_PORTIONS_REG_EXP
    );

    if (portions) {
      portions.forEach((portion, index, portions) => {
        const link = document.createElement('a');

        link.className = 'breadcrumb';
        link.textContent = portion;
        link.href = `/${portions.slice(0, index + 1).join('/')}`;

        this._container?.appendChild(link);
      });
    }
  }
}

export const template = `
  <template>
    <nav id="breadcrumbs" aria-label="breadcrumbs navigation">
      <slot></slot>
    </nav>
    <style>
      @import './styles/main.css';

      #breadcrumbs {
        display: none;
      }

      @media only screen and (min-width: 768px) {
        #breadcrumbs {
          display: flex;
          position: fixed;
          left: calc(var(--side-nav-width) + 1rem);
          top: calc(var(--top-bar-height) + 1rem);
        }

        .breadcrumb {
          font-size: .9em;
          opacity: .7;
        }

        .breadcrumb:hover,
        .breadcrumb:focus {
          opacity: 1;
        }

        .breadcrumb+.breadcrumb {
          margin-left: .5em;
        }

        .breadcrumb+.breadcrumb::before {
          content: '→';
          margin-right: .5em;
        }
      }
    </style>
  </template>
`;
