import { CustomElement } from '../core/core.js';


export class RWPNav extends CustomElement {
  static BREAKPOINT = 768;
  static TOUCH_ANGLE_THRESHOLD = 0.8;

  _touchData = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  };

  _backgroundDimmerOpacity = 0;
  _width;
  _isHidden;
  _lastActionOnEventListeners;
  _toggleButton;
  _sideNavToggleButton;
  _container;
  _backgroundDimmer;

  constructor() {
    super(template);

    this.toggle = this.toggle.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);

    this._container = this.shadowRoot.querySelector('#side-nav');
    this._toggleButton = this.shadowRoot.querySelector('#toggle-button');
    this._sideNavToggleButton = this.shadowRoot.querySelector('#side-nav-toggle-button');
    this._backgroundDimmer = this.shadowRoot.querySelector('#background-dimmer');

    this._width = Number.parseInt(
      self.getComputedStyle(this._container).width
    );

    this._isHidden = self.innerWidth < RWPNav.BREAKPOINT;

    this._toggleButton.addEventListener('click', this.toggle);
    this._sideNavToggleButton.addEventListener('click', this.toggle);
    this._backgroundDimmer.addEventListener('click', this.toggle);

    this.manageEventListeners('add');
    this.handleResize();

    self.addEventListener('resize', this.handleResize);

    this.setContainerAriaHiddenAttribute();
  }

  manageEventListeners(action) {
    const method = `${action}EventListener`;

    document[method]('keyup', this.handleKeyUp);
    document[method]('touchstart', this.handleTouchStart);
    document[method]('touchmove', this.handleTouchMove);
    document[method]('touchend', this.handleTouchEnd);

    self[method]('popstate', this.toggle);
    self[method]('route', this.toggle);

    this._lastActionOnEventListeners = action;
  }

  setContainerAriaHiddenAttribute(value = this._isHidden) {
    this._container.setAttribute('aria-hidden', value);
    this.setAttribute('aria-hidden', value);
  }

  set containerTranslateX(value) {
    this._container.style.transform = `translateX(${value}px)`;
  }

  set backgroundDimmerOpacity(value) {
    this._backgroundDimmer.style.opacity = value;
  }

  offsetContainerTranslateX(deltaX) {
    const translate = deltaX + (this._isHidden ? this._width * -1 : 0);

    if (Math.abs(deltaX) > this._width)
      return;

    this._container.style.transform = `translateX(${translate}px)`;
  }

  toggleAnimating(...elements) {
    elements.forEach(element => element.classList.toggle('is-animating'));
  }

  toggle() {
    this._container.removeAttribute('style');
    this._backgroundDimmer.removeAttribute('style');

    this._isHidden = !this._isHidden;

    if (this._isHidden) {
      this._backgroundDimmerOpacity = 0;
    } else {
      this._backgroundDimmerOpacity = 1;
    }

    this.setContainerAriaHiddenAttribute();
  }

  toggleButtonPressed(clientX, clientY) {
    const element = this.shadowRoot.elementFromPoint(clientX, clientY);

    if (element)
      return element.closest('#toggle-button') !== null;
    return false;
  }

  handleKeyUp({ key }) {
    if (!this._isHidden && key === 'Escape')
      this.toggle();
  }

  handleResize() {
    if (self.innerWidth >= RWPNav.BREAKPOINT &&
      this._lastActionOnEventListeners === 'add'
    ) {
      this._isHidden = true;
      this.toggle();
      this.manageEventListeners('remove');
    } else if (self.innerWidth < RWPNav.BREAKPOINT &&
      this._lastActionOnEventListeners === 'remove'
    ) {
      this._isHidden = false;
      this.toggle();
      this.manageEventListeners('add');
    }
  }

  handleTouchStart({ touches }) {
    const { clientX, clientY } = touches[0];

    this._touchData.startX = clientX;
    this._touchData.startY = clientY;

    if (this.toggleButtonPressed(clientX, clientY))
      return;

    this.toggleAnimating(this._container, this._backgroundDimmer);
  }

  handleTouchMove({ touches }) {
    const { clientX, clientY } = touches[0];

    this._touchData.currentX = clientX;
    this._touchData.currentY = clientY;

    if (this.toggleButtonPressed(clientX, clientY))
      return;

    if (RWPNav.calcTouchAngle(this._touchData) < RWPNav.TOUCH_ANGLE_THRESHOLD) {
      this._touchData.currentX = 0;
      this._touchData.currentY = 0;
      return;
    }

    const direction = RWPNav.getTouchDirection(this._touchData);

    if ((!this._isHidden && direction >= 0) || (this._isHidden && direction < 0))
      return;

    const [deltaX] = RWPNav.calcTouchDelta(this._touchData);

    this.offsetContainerTranslateX(deltaX);

    this.backgroundDimmerOpacity =
      this._backgroundDimmerOpacity + Math.abs(deltaX / this._width) * direction;
  }

  handleTouchEnd() {
    if (this.toggleButtonPressed(this._touchData.startX, this._touchData.startY))
      return;

    this.toggleAnimating(this._container, this._backgroundDimmer);
    const touchDelta = RWPNav.calcTouchDelta(this._touchData)[0];

    if ((!this._isHidden && touchDelta > (this._width * -1) / 2) ||
      (this._isHidden && touchDelta < this._width / 2)) {

      if (this._isHidden) {
        this.containerTranslateX = 0 - this._width;
        this.backgroundDimmerOpacity = 0;
      } else {
        this.containerTranslateX = 0;
        this.backgroundDimmerOpacity = 1;
      }
    } else this.toggle();
  }

  static getTouchDirection({ startX, currentX }) {
    if (startX > currentX) return -1;
    if (startX < currentX) return 1;

    return 0;
  }

  static calcTouchDelta({ startX, startY, currentX, currentY }) {
    if (currentX === 0 && currentY === 0)
      return [0, 0];
    return [currentX - startX, currentY - startY];
  }

  static calcTouchAngle(touchData) {
    const [deltaX, deltaY] = this.calcTouchDelta(touchData);

    const touchVector = Math.sqrt(
      Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
    );

    return Math.abs(deltaX) / touchVector;
  }
}

export const template = `
  <template>
    <header id="top-bar" aria-label="top bar">
      <button id="toggle-button" aria-label="main-navigation-toggle" type="button">
        <svg width="24" height="21" viewBox="0 0 24 15">
          <rect x="0" y="0" width="24" height="3" />
          <rect x="0" y="6" width="24" height="3" />
          <rect x="0" y="12" width="24" height="3" />
        </svg>
      </button>
      <h2 id="top-bar-title">
        <slot name="title"><abbr title="Rubic's Web Platform">RWP</abbr></slot>
      </h2>
    </header>
    <aside id="side-nav" aria-label="main-navigation" aria-hidden="true">
      <button id="side-nav-toggle-button" type="button"></button>
      <slot id="side-nav-before-links" name="before-links"></slot>
      <slot id="side-nav-links" name="links"></slot>
      <slot id="side-nav-after-links" name="after-links"></slot>
    </aside>
    <div id="background-dimmer"></div>
    <style>
      @import './styles/main.css';

      .is-animating {
        transition: none !important;
      }

      #side-nav {
        z-index: 100;
        display: grid;
        gap: 2rem;
        align-content: space-between;
        position: fixed;
        top: 0;
        left: 0;
        background-color: var(--theme-background-contrast);
        width: var(--side-nav-width);
        height: 100vh;
        box-shadow: var(--box-shadow-border-x);
        will-change: transform;
        transform: translateX(0);
        transition: transform ease-in-out var(--transition-duration-medium);
      }

      #side-nav-toggle-button {
        display: none;
      }

      #side-nav[aria-hidden="true"] {
        transform: translateX(-100%);
      }

      #side-nav[aria-hidden="true"]~#background-dimmer {
        opacity: 0;
        pointer-events: none;
      }

      #background-dimmer {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        will-change: opacity;
        background-color: rgba(0, 0, 0, .65);
        transition: opacity ease-in var(--transition-duration-medium);
        z-index: 98;
        pointer-events: all;
      }

      #side-nav-links::slotted(ul),
      #side-nav-links::slotted(ol) {
        display: grid;
        gap: 1rem;
        margin: 0;
        list-style: none;
      }

      #side-nav-before-links::slotted(*) {
        padding-top: 2rem;
      }

      #side-nav-before-links::slotted(*),
      #side-nav-links::slotted(*),
      #side-nav-after-links::slotted(*) {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      #side-nav-after-links::slotted(*) {
        padding-bottom: 4rem;
      }

      #side-nav-before-links::slotted(.no-padding),
      #side-nav-links::slotted(.no-padding),
      #side-nav-after-links::slotted(.no-padding) {
        padding: 0;
      }

      #top-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: var(--top-bar-height);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: center;
        padding: 1rem;
        background-color: var(--theme-background-contrast);
        z-index: 97;
        box-shadow: var(--box-shadow-border-y);
      }

      #top-bar-title {
        margin: 0;
        text-align: center;
      }

      #top-bar-title abbr {
        text-decoration: none;
      }

      #toggle-button {
        --size: 24px;
        width: var(--size);
        height: var(--size);
        justify-self: start;
        display: flex;
        justify-content: center;
        align-items: center;
        background: transparent;
        border: none;
        font-size: inherit;
        font-family: inherit;
        color: inherit;
        padding: 0;
        z-index: 99;
      }

      #toggle-button rect {
        fill: currentColor;
      }

      @media only screen and (min-width: 768px) {
        #side-nav {
          padding-top: var(--top-bar-height);
          box-shadow: 1px var(--top-bar-height) var(--box-shadow-color);
          background-color: transparent;
        }

        #side-nav-toggle-button {
          --size: 1.5rem;
          --offset: .75rem;

          display: grid;
          place-content: center;
          width: var(--size);
          height: var(--size);
          position: absolute;
          bottom: var(--offset);
          right: var(--offset);
          font-size: .9rem;
          line-height: 1;
          color: inherit;
          background-color: transparent;
          border: 1px dashed currentColor;
          border-radius: 100vw;
          transition: right ease-in-out var(--transition-duration-fast);
        }

        #side-nav-toggle-button::after {
          content: '←';
        }

        #side-nav[aria-hidden="true"] #side-nav-toggle-button {
          right: calc(0px - 3 * var(--offset));
        }

        #side-nav[aria-hidden="true"] #side-nav-toggle-button::after {
          content: '→';
        }

        #toggle-button {
          display: none;
        }

        #top-bar {
          grid-template-columns: 1fr;
        }

        #top-bar-title {
          text-align: left;
        }

        #background-dimmer {
          display: none;
        }
      }
    </style>
  </template>
`;