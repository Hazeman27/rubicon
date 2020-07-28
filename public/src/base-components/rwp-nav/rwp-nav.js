import RWPElement from '../rwp-element.js';

/**
 * `SideNav` - custom element. Implements both native android like top bar and
 * sidebar with full touch control.
 */
class RWPNav extends RWPElement {
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
	_backgroundDimmerOpacity = 0;

	/** @type {number} */
	_width;

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

	constructor() {
		super();

		this.toggle = this.toggle.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
	}

	/** @override */
	init() {
		super.init();

		this._container = this.shadowRoot.querySelector('#side-nav');
		this._toggleButton = this.shadowRoot.querySelector('#toggle-button');
		this._backgroundDimmer = this.shadowRoot.querySelector('#background-dimmer');

		this._width = Number.parseInt(
			self.getComputedStyle(this._container).width
		);

		this._isHidden = self.innerWidth < RWPNav.BREAKPOINT;

		this._toggleButton.addEventListener('click', this.toggle);
		this._backgroundDimmer.addEventListener('click', this.toggle);

		this.manageEventListeners('add');
		this.handleResize();

		self.addEventListener('resize', this.handleResize);

		this.setContainerAriaHiddenAttribute();
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

		self[method]('popstate', this.toggle);
		self[method]('route', this.toggle);

		this._lastActionOnEventListeners = action;
	}

	/**
	 * Sets aria-hidden attribute of the container of the side nav to
	 * value of `this.isHidden` property of this class.
	 */
	setContainerAriaHiddenAttribute(value = this._isHidden) {
		this._container.setAttribute('aria-hidden', value);
	}

	/** @param {number} value */
	set containerTranslateX(value) {
		this._container.style.transform = `translateX(${value}px)`;
	}

	/** @param {number} value */
	set backgroundDimmerOpacity(value) {
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

	/** @param {HTMLElement} element */
	toggleButtonPressed(element) {
		if (!element)
			return false;
		return element.closest('rwp-nav') !== null;
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

		else if (self.innerWidth < RWPNav.BREAKPOINT &&
			this._lastActionOnEventListeners === 'remove'
		) {
			this._isHidden = false;
			this.toggle();
			this.manageEventListeners('add');
		}
	}

	/** @param {TouchEvent} event */
	handleTouchStart({ target, touches }) {

		if (this._isHidden && this.toggleButtonPressed(target))
			return;

		this._touchData.startX = touches[0].clientX;
		this._touchData.startY = touches[0].clientY;

		this.toggleAnimating(this._container, this._backgroundDimmer);
	}

	/** @param {TouchEvent} event */
	handleTouchMove({ target, touches }) {

		if (this._isHidden && this.toggleButtonPressed(target))
			return;

		this._touchData.currentX = touches[0].clientX;
		this._touchData.currentY = touches[0].clientY;

		if (RWPNav.calcTouchAngle(this._touchData) < RWPNav.TOUCH_ANGLE_THRESHOLD) {
			this._touchData.currentX = 0;
			this._touchData.currentY = 0;
			return;
		}

		const direction = RWPNav.getTouchDirection(this._touchData);

		if ((!this._isHidden && direction >= 0) ||
			(this._isHidden && direction < 0))
			return;

		const [deltaX] = RWPNav.calcTouchDelta(this._touchData);

		this.offsetContainerTranslateX(deltaX);

		this.backgroundDimmerOpacity =
			this._backgroundDimmerOpacity + Math.abs(deltaX / this._width) * direction;
	}

	/** @param {TouchEvent} event */
	handleTouchEnd({ target }) {

		if (this._isHidden && this.toggleButtonPressed(target))
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
		}

		else this.toggle();
	}

	/**
	 * @typedef {object} TouchData object that contains relevant touch data.
	 * @property {number} currentX
	 * @property {number} currentY
	 * @property {number} startX
	 * @property {number} startY
	 */

	/**
	 * Returns direction of the ongoing touch.
	 * - **-1** if touch direction is to the left;
	 * - **1** if touch direction is to the right;
	 * - **0** otherwise;
	 *
	 * @param {TouchData} touchData
	 * @returns { -1 | 1 | 0 } direction of the ongoing touch.
	 */
	static getTouchDirection({ startX, currentX }) {

		if (startX > currentX) return -1;
		if (startX < currentX) return 1;

		return 0;
	}

	/**
	 * @param {TouchData} touchData
	 * @returns {number[]}
	 */
	static calcTouchDelta({ startX, startY, currentX, currentY }) {
		return [currentX - startX, currentY - startY];
	}

	/**
	 * @param {TouchData} touchData
	 * @returns {number} cosine of the touch angle.
	 */
	static calcTouchAngle(touchData) {

		const [deltaX, deltaY] = this.calcTouchDelta(touchData);

		const touchVector = Math.sqrt(
			Math.pow(deltaX, 2) + Math.pow(deltaY, 2)
		);

		return Math.abs(deltaX) / touchVector;
	}
}

export default RWPNav;
