import { fetchTemplate, attachShadowRoot } from '../echo.js';

const SIDE_NAV_WIDTH = 260;
const BREAKPOINT = 768;

/**
 * `SideNav` - custom element. Implements both native android like top bar and
 * sidebar with full touch control.
 */

class SideNav extends HTMLElement {
    isHidden;
    lastActionOnEventListeners;
    touchData = {};
    toggleButton;
    container;
    backgroundDimmer;

    constructor() {
        super();

        this.toggle = this.toggle.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);

        (async () => {
            const template = await fetchTemplate(
                '/src/components/side-nav/side-nav.html'
            );

            const shadowRoot = attachShadowRoot(this, template);

            this.container = shadowRoot.querySelector('#side-nav');
            this.toggleButton = shadowRoot.querySelector('#toggle-button');
            this.backgroundDimmer = shadowRoot.querySelector('#background-dimmer');
            
            if (window.innerWidth >= BREAKPOINT)
                this.isHidden = false;
            
            else
                this.isHidden = true;

            this.setContainerAriaHiddenAttribute();

            this.toggleButton.addEventListener('click', this.toggle);
            this.backgroundDimmer.addEventListener('click', this.toggle);

            this.manageEventListeners('add');
            window.addEventListener('resize', this.handleResize);
        })();
    }

    /**
     * Adds or removes document touch and keyup event listeners.
     * 
     * @param {'add' | 'remove'} action
     */

    manageEventListeners(action) {
        const method = `${action}EventListener`;

        document[method]('keyup', this.handleKeyUp);
        document[method]('touchstart', this.handleTouchStart);
        document[method]('touchmove', this.handleTouchMove);
        document[method]('touchend', this.handleTouchEnd);

        this.lastActionOnEventListeners = action;
    }

    /**
     * Sets aria-hidden attribute of the container of the side nav to
     * value of `this.isHidden` property of this class.
     */

    setContainerAriaHiddenAttribute() {
        this.container.setAttribute('aria-hidden', this.isHidden)
    }

    /**
     * Returns direction of the ongoing touch.
     * - **-1** if touch direction is to the left;
     * - **1** if touch direction is to the right;
     * - **0** otherwise;
     * 
     * @returns { -1 | 1 | 0 }
     */

    getTouchDirection() {
        if (this.touchData.startX > this.touchData.currentX)
            return -1;

        if (this.touchData.startX < this.touchData.currentX)
            return 1;

        return 0;
    }

    /**
     * Calculates delta (difference) of the `clientX` value of the `touchstart`
     * and `touchmove` events.
     * 
     * @returns {number} delta (difference) of the `clientX` value of the
     * `touchstart` and `touchmove` events.
     */

    getTouchDelta() {
        return this.touchData.currentX - this.touchData.startX;
    }

    /**
     * Sets value for the `translateX` function of the `transform` property
     * of the side nav container.
     * 
     * @param {number} value value for the `translateX` function.
     */

    setContainerTranslateX(value) {
        this.container.style.transform = `translateX(${value}px)`;
    }

    /**
     * Offsets value of the `translateX` function of the side nav container.
     *  
     * @param {number} offset 
     */

    offsetContainerTranslateX(offset) {
        let translate = offset + (this.isHidden ? SIDE_NAV_WIDTH * -1 : 0);

        if (Math.abs(offset) > SIDE_NAV_WIDTH)
            return;

        this.container.style.transform = `translateX(${translate}px)`;
    }

    /**
     * Sets `data-animating` attribute of the side nav container.
     * 
     * @param {boolean} value 
     */

    setContainerAnimating(value) {
        this.container.setAttribute('data-animating', value);
    }

    /**
     * Toggles side nav. Removes `style` attribute of the side nav container to
     * avoid side effects caused by touch events.
     */

    toggle() {
        this.container.removeAttribute('style');
        this.isHidden = !this.isHidden;
        this.setContainerAriaHiddenAttribute();
    }

    /**
     * `keyup` event handler. Toggles side nav if pressed key is `Escape`.
     * @param {KeyboardEvent} event 
     */

    handleKeyUp({ key }) {
        if (!this.isHidden && key === 'Escape')
            this.toggle();
    }

    /**
     * Window resize handler. Adds / Removes document event listeners and
     * toggles side nav based on current screen size.
     */

    handleResize() {
        if (window.innerWidth >= BREAKPOINT &&
            this.lastActionOnEventListeners === 'add'
            ) {
            this.isHidden = true;
            this.toggle();
            this.manageEventListeners('remove');
        }

        if (window.innerWidth < BREAKPOINT &&
            this.lastActionOnEventListeners === 'remove'
            ) {
            this.isHidden = false;
            this.toggle();
            this.manageEventListeners('add');
        }
    }

    /**
     * `touchstart` event handler.
     * 
     * @param {TouchEvent} event touch event. 
     */

    handleTouchStart({ touches }) {
        this.touchData.startX = touches[0].clientX;
        this.setContainerAnimating(true);
    }

    /**
     * `touchmove` event handler. Offsets side nav's X position by the touch
     * delta value.
     * 
     * @param {TouchEvent} event touch event. 
     */

    handleTouchMove({ touches }) {
        this.touchData.currentX = touches[0].clientX;
        const touchDirection = this.getTouchDirection();
        
        if ((!this.isHidden && touchDirection >= 0) ||
            (this.isHidden && touchDirection < 0))
            return;

        this.offsetContainerTranslateX(this.getTouchDelta());
    }

    /**
     * `touchend` event handler. Toggles side nav if touch has exceeded toggle
     * threshold.
     */

    handleTouchEnd() {
        this.setContainerAnimating(false);
    
        if (Math.abs(this.getTouchDelta()) > SIDE_NAV_WIDTH / 2) {
            this.toggle();
            return;
        }
        
        this.setContainerTranslateX(this.isHidden ? 0 - SIDE_NAV_WIDTH : 0);
    }
}

export default SideNav;