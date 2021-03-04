import { CustomElement } from '../../core/core.js';
import { RWPRoute } from './rwp-route.js';


export class RWPRouter extends CustomElement {
  static routers = [];

  _routes = [];
  _defaultRoute;

  constructor() {
    super('<template><slot></slot></template>');

    if (RWPRouter.routers.length === 0) {
      document.addEventListener('click', this);
      self.addEventListener('popstate', this);
      self.addEventListener('route', this);
    }

    RWPRouter.routers.push(this);
  }

  handleEvent(event) {
    if (event.type === 'click')
      RWPRouter.handleLinkClick(event);

    else if (event.type === 'popstate' || event.type === 'route')
      RWPRouter.routers.forEach(router => router.route(event));
  }

  route(event) {
    let href;
    let matchingRoute = null;

    if (!event?.detail?.href) href = location.pathname;
    else href = event.detail.href;

    for (const route of this._routes) {
      if (route.path.regex.test(href))
        matchingRoute = route;

      else route.setAttribute('current', 'false');
    }

    if (!matchingRoute && this._defaultRoute)
      matchingRoute = this._defaultRoute;

    matchingRoute?.setAttribute('current', 'true');
  }

  addRoute(route) {
    this._routes.push(route);

    if (route.default) {
      this._defaultRoute = route;
      this.route();
    } else if (route.path.regex.test(location.pathname)) {
      this.route();
    }
  }

  static handleLinkClick(event) {
    let target = event.target;

    if (target?.nodeName.toLowerCase() !== 'a')
      target = RWPRouter.findTargetLink(event);

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

  static findTargetLink(event) {
    const shadowRoot = event.target?.shadowRoot;

    const links = shadowRoot?.querySelectorAll('a') ?? [];

    if (links.length === 0)
      return null;

    const { clientX, clientY } = event;

    let boundingRectangle;

    for (const link of links) {
      boundingRectangle = link.getBoundingClientRect();

      if (this.isInsideElement(boundingRectangle, clientX, clientY))
        return link;
    }

    return null;
  }

  static isInsideElement(boundingRectangle, clientX, clientY) {
    return clientX > boundingRectangle.left && clientX < boundingRectangle.right &&
      clientY > boundingRectangle.top && clientY < boundingRectangle.bottom;
  }
}
