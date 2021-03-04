import * as RWPButton from './base-components/rwp-button.js';
import * as RWPColorScheme from './base-components/rwp-color-scheme.js';
import * as RWPEmbed from './base-components/rwp-embed.js';
import * as RWPContacts from './components/rwp-contacts.js';
import * as RWPProfile from './components/rwp-profile.js';
import { RWPBreadcrumbs } from './base-components/rwp-router/rwp-breadcrumbs.js';
import { RWPNav } from './base-components/rwp-nav.js';
import { RWPRoute } from './base-components/rwp-router/rwp-route.js';
import { RWPRouter } from './base-components/rwp-router/rwp-router.js';
import { registerCustomElements } from './core/core.js';

registerCustomElements([
  RWPButton,
  RWPColorScheme,
  RWPEmbed,
  RWPContacts,
  RWPProfile,
  RWPBreadcrumbs,
  RWPNav,
  RWPRoute,
  RWPRouter,
]);
