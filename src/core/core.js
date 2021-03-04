import { generateCustomElementName } from './core-utils.js';

export class CustomElement extends HTMLElement {
  constructor(templateValue) {
    super();
    const shadowRoot =this.attachShadow({ mode: 'open' });

    shadowRoot.appendChild(
      typeof templateValue === 'string'
        ? (template(templateValue) ?? document.createElement('template'))
        : templateValue
    );
  }
}

export async function fetchTemplate(path) {
  try {
    const response = await fetch(path);
    const text = await response.text();

    const document = new DOMParser().parseFromString(text, 'text/html');
    const template = document.querySelector('template');

    return template?.content.cloneNode(true);

  } catch (error) {
    console.error(error, path);
    return null;
  }
}

export function template(string) {
  const document = new DOMParser().parseFromString(string.toString(), 'text/html');
  const template = document.querySelector('template');

  return template?.content.cloneNode(true) ?? null;
}

export function registerCustomElement(definition) {
  if (typeof definition === 'function') {
    customElements.define(generateCustomElementName(definition.name), definition);
    return;
  }

  if (definition.elementConstructor) {
    customElements.define(
      definition.name ?? generateCustomElementName(definition.elementConstructor.name),
      definition.elementConstructor,
      definition.options,
    )
  }

  let initFunction = definition.init;

  if (!initFunction) {
    const initFunctionKey = Object.keys(definition).find((key) => {
      return typeof definition[key] === 'function';
    });

    if (initFunctionKey) initFunction = definition[initFunctionKey];
  }

  if (!initFunction) {
    throw Error(`
      Custom element must have an initializer function! Provide a non-anonymous
      function as an export for your custom element definition, alternatively
      define and export  a class that extends CustomElement abstract class. You
      can also export a function named 'init' as an initializer function.
    `);
  }

  const name = definition.name ?? generateCustomElementName(initFunction.name);

  class NewCustomElement extends CustomElement {
    constructor() {
      super((
        typeof definition.template === 'string'
          ? template(definition.template)
          : definition.template?.() 
        ) ?? document.createElement('template')
      );

      initFunction(this);
    }
  }

  customElements.define(name, NewCustomElement, definition.options);
}

export function registerCustomElements(definitions) {
  definitions.forEach(registerCustomElement);
}
