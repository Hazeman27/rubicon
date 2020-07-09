import { initCustomElement } from '../echo.js';
import { addColorSchemeControls } from './modules/color-scheme.js';
import {
	getTouchDirection,
	calcTouchAngle,
	calcTouchDelta,
} from './modules/touch-helpers.js';

/**
 * `SideNav` - custom element. Implements both native android like top bar and
 * sidebar with full touch control.
 *
 * @todo Add breadcrumbs
 * @todo Add profile page
 */
class RWPNav extends HTMLElement {
	/** @readonly */
	static BREAKPOINT = 768;

	/** @readonly */
	static TOUCH_ANGLE_THRESHOLD = 0.8;

	/** @type {TouchData} */
	_touchData = {
		startX: 0,
		startY: 0,
		currentX: 0,
		currentY: 0
	};

	/** @type {number} */
	_width;

	/** @type {number} transition duration in seconds. */
	_transitionDuration;

	/** @type {boolean} */
	_isHidden;

	/** @type {'add' | 'remove'} */
	_lastActionOnEventListeners;

	/** @type {HTMLButtonElement} */
	_toggleButton;

	/** @type {HTMLElement} */
	_container;

	/** @type {HTMLElement} */
	_backgroundDimmer;

	/** @type {number} */
	_backgroundDimmerOpacity = 0;

	constructor() {
		super();

		this.toggle = this.toggle.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);

		initCustomElement(this, '/src/components/rwp-nav/rwp-nav.html')
			.then(shadowRoot => {
				this._container = shadowRoot.querySelector('#side-nav');
				this._toggleButton = shadowRoot.querySelector('#toggle-button');
				this._backgroundDimmer = shadowRoot.querySelector('#background-dimmer');

				this._width = Number.parseInt(
					self.getComputedStyle(this._container).width
				);

				this._transitionDuration = Number.parseFloat(
					self.getComputedStyle(this._container).transitionDuration
				);

				this._isHidden = self.innerWidth < RWPNav.BREAKPOINT;

				this._toggleButton.addEventListener('click', this.toggle);
				this._backgroundDimmer.addEventListener('click', this.toggle);

				this.manageEventListeners('add');
				self.addEventListener('resize', this.handleResize);

				this.setContainerAriaHiddenAttribute();
				addColorSchemeControls(shadowRoot.querySelector('#color-scheme-select'));
			});
	}

	/**
	 * Adds or removes document touch and keyup event listeners.
	 * @param {'add' | 'remove'} action
	 */
	manageEventListeners(action) {

		const method = `${action}EventListener`;

		document[method]('keyup', this.handleKeyUp);
		document[method]('touchstart', this.handleTouchStart);
		document[method]('touchmove', this.handleTouchMove);
		document[method]('touchend', this.handleTouchEnd);

		this._lastActionOnEventListeners = action;
	}

	/**
	 * Sets aria-hidden attribute of the container of the side nav to
	 * value of `this.isHidden` property of this class.
	 */
	setContainerAriaHiddenAttribute() {
		this._container.setAttribute('aria-hidden', this._isHidden);
	}

	/** @param {number} value */
	setContainerTranslateX(value) {
		this._container.style.transform = `translateX(${value}px)`;
	}

	/** @param {number} value */
	setBackgroundDimmerOpacity(value) {
		this._backgroundDimmer.style.opacity = value;
	}

	/** @param {number} deltaX */
	offsetContainerTranslateX(deltaX) {

		let translate = deltaX + (this._isHidden ? this._width * -1 : 0);

		if (Math.abs(deltaX) > this._width)
			return;

		this._container.style.transform = `translateX(${translate}px)`;
	}

	/**
	 * Adds `is-animating` class to the element.
	 *
	 * @param {boolean} value
	 * @param {...HTMLElement} elements
	 */
	toggleAnimating(...elements) {
		elements.forEach(element => element.classList.toggle('is-animating'));
	}

	/**
	 * @param {Event} _event
	 * @param {number} [touchDelta=0]
	 */
	toggle(_event, touchDelta = 0) {

		this._container.removeAttribute('style');
		this._backgroundDimmer.removeAttribute('style');

		this._isHidden = !this._isHidden;

		if (this._isHidden) {
			this._backgroundDimmerOpacity = 0;
		} else {
			this._backgroundDimmerOpacity = 1;
		}

		if (touchDelta !== 0) {
			const duration =
				this._transitionDuration * (Math.abs(touchDelta) / this._width);

			this._container.style.transitionDuration = `${duration}s`;

			setTimeout(() => {
				this._container.removeAttribute('style');
			}, duration * 1500);
		}

		this.setContainerAriaHiddenAttribute();
	}

	/** @param {HTMLElement} element */
	toggleButtonPressed(element) {

		if (!element)
			return false;

		return element.closest('#toggle-button') !== null;
	}

	/** @param {KeyboardEvent} event */
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
		}

		if (self.innerWidth < RWPNav.BREAKPOINT &&
			this._lastActionOnEventListeners === 'remove'
		) {

			this._isHidden = false;
			this.toggle();
			this.manageEventListeners('add');
		}
	}

	/** @param {TouchEvent} event touch event. */
	handleTouchStart({ originalTarget, touches }) {

		if (this.toggleButtonPressed(originalTarget))
			return;

		this._touchData.startX = touches[0].clientX;
		this._touchData.startY = touches[0].clientY;

		this.toggleAnimating(this._container, this._backgroundDimmer);
	}

	/** @param {TouchEvent} event touch event. */
	handleTouchMove({ originalTarget, touches }) {

		if (this.toggleButtonPressed(originalTarget))
			return;

		this._touchData.currentX = touches[0].clientX;
		this._touchData.currentY = touches[0].clientY;

		if (calcTouchAngle(this._touchData) < RWPNav.TOUCH_ANGLE_THRESHOLD) {
			this._touchData.currentX = 0;
			this._touchData.currentY = 0;
			return;
		}

		const direction = getTouchDirection(this._touchData);

		if ((!this._isHidden && direction >= 0) ||
			(this._isHidden && direction < 0))
			return;

		const [deltaX] = calcTouchDelta(this._touchData);

		this.offsetContainerTranslateX(deltaX);

		this.setBackgroundDimmerOpacity(
			this._backgroundDimmerOpacity + Math.abs(deltaX / this._width) * direction
		);
	}

	/** @param {TouchEvent} event touch event. */
	handleTouchEnd({ originalTarget }) {

		if (this.toggleButtonPressed(originalTarget))
			return;

		this.toggleAnimating(this._container, this._backgroundDimmer);
		const touchDelta = calcTouchDelta(this._touchData)[0];

		if ((!this._isHidden && touchDelta > (this._width * -1) / 2) ||
			(this._isHidden && touchDelta < this._width / 2)) {

			if (this._isHidden) {
				this.setContainerTranslateX(0 - this._width);
				this.setBackgroundDimmerOpacity(0);
			} else {
				this.setContainerTranslateX(0);
				this.setBackgroundDimmerOpacity(1);
			}
		}

		else this.toggle(null, touchDelta);
	}
}

export default RWPNav;
