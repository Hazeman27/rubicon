/**
 * Adds color scheme controls to select tag.
 * 
 * @typedef {'system' | 'dark' | 'light'} ColorSchemeOptions
 * @param {HTMLSelectElement} selectElement
 */

export function addColorSchemeControls(selectElement) {
    renderOptions(selectElement, setScheme(getCurrentPreference()));
    attachEventListeners(selectElement);
}

/**
 * @param {HTMLSelectElement} selectElement 
 */

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

/**
 * Renders `option` tags inside select element based on the current color scheme.
 * 
 * @param {HTMLSelectElement} selectElement
 * @param {ColorSchemeOptions} currentScheme 
 */

function renderOptions(selectElement, currentScheme) {
    
    selectElement.appendChild(createSchemeOption(currentScheme));
    
    getSchemeOptions(currentScheme).forEach(schemeOption => {
        selectElement.appendChild(createSchemeOption(schemeOption));
    });
}

/**
 * Creates object that contains data for the color scheme's `option` tag.
 * 
 * @typedef {object} ColorSchemeOption
 * @property {string} textContent
 * @property {ColorSchemeOptions} value
 * 
 * @param {ColorSchemeOptions} scheme
 * @returns {ColorSchemeOption}
 */

function createSchemeOption(scheme) {
    return Object.assign(document.createElement('option'), {
        textContent: capitalize(scheme),
        value: scheme
    });
}

/**
 * Returns array of two other available color schemes beside the current one.
 * 
 * @param {ColorSchemeOptions} currentScheme
 * @returns {ColorSchemeOptions[]}
 */

function getSchemeOptions(currentScheme) {

    if (currentScheme === 'system')
        return ['dark', 'light'];
    
    else if (currentScheme === 'dark')
        return ['light', 'system'];
    
    else
        return ['dark', 'system'];
}

/**
 * Sets `data-theme` attribute of the body tag and updates `preferred-color-scheme`
 * entry of the `localStorage` to the specified theme.
 * 
 * @param {ColorSchemeOptions} scheme 
 * @returns {ColorSchemeOptions} same parameter.
 */

function setScheme(scheme) {

    if (scheme === 'system') {
        document.body.setAttribute('data-theme', getSystemPreference());
    } else {
        document.body.setAttribute('data-theme', scheme);
    }
    
    localStorage.setItem('preferred-color-scheme', scheme);
    return scheme;
}

/**
 * Returns current color scheme preference.
 * 
 * @returns {ColorSchemeOptions}
 */

function getSystemPreference() {
    return self.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Returns `preferred-color-scheme` entry of the `localStorage`.
 * 
 * @returns {ColorSchemeOptions}
 */

function getCurrentPreference() {
    return localStorage.getItem('preferred-color-scheme') || 'system';
}

/**
 * Capitalizes first letter of the string.
 * 
 * @param {string} string 
 */

function capitalize(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
}