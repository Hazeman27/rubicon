import SideNav from './components/side-nav/side-nav.js';
import { registerCustomElement } from './components/echo.js';

/**
 * Main function. Registers all custom elements.
 */

function main() {
	registerCustomElement({
		name: 'side-nav',
		constructor: SideNav,
	});
}

main();