import { initCustomElement } from '../../core/core.js';
import RWPRoute from './rwp-route/rwp-route.js';


class RWPRouter extends HTMLElement {
  /** @type {RWPRouter[]} */
  static routers = [];

  /** @type {RWPRoute[]} */
  _routes = [];

  /** @type {RWPRoute} */
  _defaultRoute;

  /** @override */
  constructor() {
    super();

    initCustomElement(this).then(() => {
      /** Add event listeners only once. */
      if (RWPRouter.routers.length === 0) {
        document.addEventListener('click', this);
        self.addEventListener('popstate', this);
        self.addEventListener('route', this);
      }

      RWPRouter.routers.push(this);
    });
  }

  /** @param {Event} event */
  handleEvent(event) {

    if (event.type === 'click')
      RWPRouter.handleLinkClick(event);

    else if (event.type === 'popstate' || event.type === 'route')
      RWPRouter.routers.forEach(router => router.route(event));
  }

  /** @param {PopStateEvent | CustomEvent} [event] */
  route(event) {

    /** @type {string} */
    let href;

    /** @type {RWPRoute} */
    let matchingRoute;

    if (!event || !event.detail || !event.detail.href)
      href = location.pathname;
    else href = event.detail.href;

    for (const route of this._routes) {
      if (route.path.regex.test(href))
        matchingRoute = route;

      else route.setAttribute('current', 'false');
    }

    if (!matchingRoute && this._defaultRoute)
      matchingRoute = this._defaultRoute;

    matchingRoute.setAttribute('current', 'true');
  }

  /** @param {RWPRoute} route */
  addRoute(route) {
    this._routes.push(route);

    if (route.default) {
      this._defaultRoute = route;
      this.route();
    } else if (route.path.regex.test(location.pathname)) {
      this.route();
    }
  }

  /** @param {MouseEvent} event */
  static handleLinkClick(event) {

    let target;

    if (event.target.nodeName.toLowerCase() === 'a') {
      target = event.target;
    } else if (event.target.shadowRoot) {
      target = RWPRouter.findTargetLink(event);
    }

    if (!target) return;

    const href = target.href.replace(location.origin, '');

    event.preventDefault();
    self.history.pushState({}, href, href);

    self.dispatchEvent(new CustomEvent('route', {
      detail: {
        href,
      }
    }));
  }

  /**
   * Looks for the link element of the event target. Returns link element if
   * found, `null` otherwise.
   *
   * @param {MouseEvent} event
   * @returns {HTMLLinkElement | null}
   */
  static findTargetLink(event) {
    /** @type {ShadowRoot} */
    const shadowRoot = event.target.shadowRoot;

    const links = shadowRoot.querySelectorAll('a');

    if (links.length === 0)
      return null;

    const {
      clientX,
      clientY
    } = event;
    let boundingRectangle;

    for (const link of links) {
      boundingRectangle = link.getBoundingClientRect();

      if (this.isInsideElement(boundingRectangle, clientX, clientY))
        return link;
    }

    return null;
  }

  /**
   * @param {DOMRect} boundingRectangle Element's bounding rectangle.
   * @param {number} clientX
   * @param {number} clientY
   * @returns {boolean} `true` if client is inside element's bounding rectangle.
   */
  static isInsideElement(boundingRectangle, clientX, clientY) {
    return clientX > boundingRectangle.left && clientX < boundingRectangle.right &&
      clientY > boundingRectangle.top && clientY < boundingRectangle.bottom;
  }
}

export default RWPRouter;