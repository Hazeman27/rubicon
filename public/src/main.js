import RWPNav from './components/rwp-nav/rwp-nav.js';
import RWPBreadcrumbs from './components/rwp-router/rwp-breadcrumbs/rwp-breadcrumbs.js';
import RWPButton from './components/rwp-button/rwp-button.js';
import RWPRouter from './components/rwp-router/rwp-router.js';
import RWPRoute from './components/rwp-router/rwp-route/rwp-route.js';
import { registerCustomElements } from './core/core.js';

registerCustomElements([{
	name: 'rwp-nav',
	constructor: RWPNav,
}, {
	name: 'rwp-breadcrumbs',
	constructor: RWPBreadcrumbs,
}, {
	name: 'rwp-button',
	constructor: RWPButton,
}, {
	name: 'rwp-router',
	constructor: RWPRouter,
}, {
	name: 'rwp-route',
	constructor: RWPRoute,
}]);
