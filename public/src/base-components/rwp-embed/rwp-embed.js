import RWPElement from '../rwp-element.js';

class RWPEmbed extends RWPElement {
	/** @readonly */
	static OPEN_ATTR = 'data-open';

	/** @type {HTMLElement} */
	_wrapper;

	/** @type {HTMLElement} */
	_header;

	/** @type {HTMLElement} */
	_content;

	/** @type {HTMLButtonElement} */
	_closeButton;

	constructor() {
		super();
		this.toggle = this.toggle.bind(this);
		this.setPosition = this.setPosition.bind(this);
	}

	/** @override */
	init() {
		this._wrapper = this.shadowRoot.querySelector('#wrapper');
		this._header = this.shadowRoot.querySelector('#header');
		this._content = this.shadowRoot.querySelector('#content');
		this._closeButton = this.shadowRoot.querySelector('#close-button');

		this._header.addEventListener('click', this.toggle);
		this._closeButton.addEventListener('click', this.toggle);

		document.addEventListener('keyup', ({ key }) => {
			if (key === 'Escape' && this._wrapper.hasAttribute(RWPEmbed.OPEN_ATTR))
				this.toggle();
		});

		self.addEventListener('resize', this.setPosition);
		this.setPosition();
	}

	toggle() {
		this._wrapper.toggleAttribute(RWPEmbed.OPEN_ATTR);

		if (this._wrapper.hasAttribute(RWPEmbed.OPEN_ATTR)) {
			this._header.removeEventListener('click', this.toggle);
		} else {
			this._header.addEventListener('click', this.toggle);
		}
	}

	setPosition() {
		this._wrapper.removeAttribute('style');
		const { top, left, width, height } = this._wrapper.getBoundingClientRect();

		this._wrapper.style.cssText = `
			top: ${top}px;
			left: ${left}px;
			width: ${width}px;
			height: ${height}px;
		`;
	}
}

export default RWPEmbed;
