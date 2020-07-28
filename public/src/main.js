import RWPNav from './base-components/rwp-nav/rwp-nav.js';
import RWPEmbed from './base-components/rwp-embed/rwp-embed.js';
import RWPBreadcrumbs from './base-components/rwp-router/rwp-breadcrumbs/rwp-breadcrumbs.js';
import RWPButton from './base-components/rwp-button/rwp-button.js';
import RWPColorScheme from './base-components/rwp-color-scheme/rwp-color-scheme.js';
import RWPRouter from './base-components/rwp-router/rwp-router.js';
import RWPRoute from './base-components/rwp-router/rwp-route/rwp-route.js';
import RWPContacts from './components/rwp-contacts/rwp-contacts.js';
import RWPProfile from './components/rwp-profile/rwp-profile.js';
import { registerCustomElements } from './core/core.js';

registerCustomElements([
	RWPNav,
	RWPEmbed,
	RWPBreadcrumbs,
	RWPButton,
	RWPColorScheme,
	RWPRouter,
	RWPRoute,
	RWPContacts,
	RWPProfile
]);
