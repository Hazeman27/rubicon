import { capitalize } from '../core/core-utils.js';


export function RWPColorScheme({ shadowRoot }) {
  addColorSchemeControls(shadowRoot.querySelector('#color-scheme-select'));
}

function addColorSchemeControls(selectElement) {
  renderOptions(selectElement, setScheme(getCurrentPreference()));
  attachEventListeners(selectElement);
}

function attachEventListeners(selectElement) {
  selectElement.addEventListener('change', () => {
    setScheme(selectElement.options.item(selectElement.options.selectedIndex).value);
  });

  self.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (getCurrentPreference() === 'system')
        setScheme('system');
    });
}

function renderOptions(selectElement, currentScheme) {
  selectElement.appendChild(createSchemeOption(currentScheme));

  getSchemeOptions(currentScheme).forEach(schemeOption => {
    selectElement.appendChild(createSchemeOption(schemeOption));
  });
}

function createSchemeOption(scheme) {
  return Object.assign(document.createElement('option'), {
    textContent: capitalize(scheme),
    value: scheme
  });
}

function getSchemeOptions(currentScheme) {
  if (currentScheme === 'system')
    return ['dark', 'light'];

  if (currentScheme === 'dark')
    return ['light', 'system'];

  return ['dark', 'system'];
}

function setScheme(scheme) {
  if (scheme === 'system') {
    document.body.setAttribute('data-theme', getSystemPreference());
  } else {
    document.body.setAttribute('data-theme', scheme);
  }

  localStorage.setItem('preferred-color-scheme', scheme);
  return scheme;
}

function getSystemPreference() {
  return self.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentPreference() {
  return localStorage.getItem('preferred-color-scheme') || 'system';
}

export const template = `
  <template>
    <section id="color-scheme">
      <label for="color-scheme-select">
        <span name="label">Select color scheme:</span>
      </label>
      <select id="color-scheme-select"></select>
    </section>
    <style>
      @import './styles/main.css';

      #color-scheme {
        display: grid;
        gap: 1em;
        justify-items: start;
        align-self: end;
      }
    </style>
  </template>
`;