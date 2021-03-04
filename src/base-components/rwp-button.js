import { calcColorDifference } from './rwp-colors.js';


export function RWPButton(element) {
  const { attributes, shadowRoot } = element;

  const button = shadowRoot?.querySelector('button');
  const type = element.getAttribute('type');

  if (type) button?.setAttribute('type', type);

  const setStyleFromAttribute = (attributeName, styleProperty) => {
    const attribute = attributes.getNamedItem(attributeName);
    if (!button || !attribute) return null;
    
    if (!styleProperty)
      styleProperty = attributeName;

    button.style[styleProperty] = attribute.value;
    return attribute.value;
  }

  const setColorBasedOnBackground = () => {
    if (
      !setStyleFromAttribute('bg-color', 'backgroundColor') &&
      !button?.style.backgroundColor
    ) {
      return;
    }

    const colorDifference = calcColorDifference(
      'white', button?.style.backgroundColor
    );

    if (colorDifference?.isGood)
      button?.style.setProperty('color', 'white', 'important');
    else
      button?.style.setProperty('color', 'black', 'important');
  };

  setColorBasedOnBackground();
};

export const template = `
  <template>
    <button>
      <span id="content">
        <slot></slot>
      </span>
    </button>
    <style>
      @import './styles/main.css';

      button {
        font-size: inherit;
        font-family: inherit;
        color: var(--theme-foreground-contrast);
        background-color: var(--theme-background);
        padding: .65em 1.5em;
        border: none;
        border-radius: var(--border-radius);
        transition:
          transform ease-in-out var(--transition-duration-fast),
          border-radius ease-in-out var(--transition-duration-fast);
      }

      button:active {
        transform: scale(.95);
        border-radius: calc(var(--border-radius) * 1.25);
      }
    </style>
  </template>
`;
