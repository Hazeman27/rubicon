import RWPNav from './components/rwp-nav/rwp-nav.js';
import RWPButton from './components/rwp-button/rwp-button.js';
import { registerCustomElements } from './components/core.js';

registerCustomElements([{
	name: 'rwp-nav',
	constructor: RWPNav,
}, {
	name: 'rwp-button',
	constructor: RWPButton,
}]);
