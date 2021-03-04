const OPEN_ATTR = 'data-open';

export function RWPEmbed({ shadowRoot }) {
  const wrapper = shadowRoot.querySelector('#wrapper');
  const header = shadowRoot.querySelector('#header');
  const closeButton = shadowRoot.querySelector('#close-button');

  const toggle = () => {
    wrapper.toggleAttribute(OPEN_ATTR);

    if (wrapper.hasAttribute(OPEN_ATTR)) header.removeEventListener('click', toggle);
    else header.addEventListener('click', toggle);
  };

  const setPosition = () => {
    wrapper.removeAttribute('style');
    const { top, left, width, height } = wrapper.getBoundingClientRect();

    wrapper.style.cssText = `
			top: ${top}px;
			left: ${left}px;
			width: ${width}px;
			height: ${height}px;
		`;
  };

  header.addEventListener('click', toggle);
  closeButton.addEventListener('click', toggle);

  document.addEventListener('keyup', ({ key }) => {
    if (key === 'Escape' && wrapper.hasAttribute(OPEN_ATTR))
      toggle();
  });

  self.addEventListener('resize', setPosition);
  setPosition();
}

export const template = `
  <template>
    <div id="wrapper">
      <button id="close-button">
        <span id="line-1"></span>
        <span id="line-2"></span>
      </button>
      <slot id="header" name="header">
        Embed Header
      </slot>
      <slot id="content" name="content">
        Embed Content...
      </slot>
    </div>
    <style>
      @import './styles/main.css';

      @keyframes fade-in {
        from {
          opacity: 0;
        } to {
          opacity: 1;
        }
      }

      #wrapper {
        background-color: var(--theme-background-contrast);
        z-index: 1000;
        overflow: auto;
        transition:
          top var(--transition-duration-medium),
          left var(--transition-duration-medium),
          width var(--transition-duration-medium),
          height var(--transition-duration-medium);
      }

      #wrapper[data-open] {
        position: absolute;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
      }

      #wrapper[data-open] #content,
      #wrapper[data-open] #close-button {
        display: initial;
        animation:
          fade-in
          ease-in-out
          var(--transition-duration-medium)
          forwards;
      }

      #wrapper[data-open] #header:hover {
        cursor: default;
      }

      #header {
        user-select: none;
      }

      #header:hover {
        cursor: pointer;
      }

      #content {
        display: none;
      }

      #close-button {
        --size: 32px;
        --offset: 1rem;

        display: none;
        position: absolute;
        right: var(--offset);
        top: var(--offset);
        width: var(--size);
        height: var(--size);
        color: white;
        background-color: transparent;
        border: none;
        padding: 0;
        margin: 0;
        z-index: 1;
      }

      #close-button #line-1,
      #close-button #line-2 {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform-origin: center;
        width: calc(var(--size) * .5);
        height: 3px;
        background-color: currentColor;
        border-radius: var(--border-radius);
      }

      #close-button #line-1 {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      #close-button #line-2 {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
    </style>
  </template>
`;