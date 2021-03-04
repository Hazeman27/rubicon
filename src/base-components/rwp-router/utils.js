export function isInsideElement(boundingRectangle, clientX, clientY) {
  return clientX > boundingRectangle.left && clientX < boundingRectangle.right &&
    clientY > boundingRectangle.top && clientY < boundingRectangle.bottom;
}

export function findTargetLink(event) {
  const shadowRoot = event.target.shadowRoot;

  const links = shadowRoot?.querySelectorAll('a') ?? [];

  if (links.length === 0)
    return null;

  const { clientX, clientY } = event;
  let boundingRectangle;

  for (const link of links) {
    boundingRectangle = link.getBoundingClientRect();

    if (isInsideElement(boundingRectangle, clientX, clientY))
      return link;
  }

  return null;
}

export function handleLinkClick(event) {
  let target = event.target;

  if (target?.nodeName.toLowerCase() !== 'a')
    target = findTargetLink(event);

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
