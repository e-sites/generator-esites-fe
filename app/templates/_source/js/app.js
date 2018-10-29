/*!
 * @section: Application JS module entry file
 * @project: PROJECT-NAME
 * @author: E-sites <frontend@e-sites.nl>
 */

// Add ES5/6/7 polyfills
import './polyfills/core-js';

// Apply SVG polyfill to load external SVG's in unsupported browsers
import 'svgxuse';

import * as conditioner from 'conditioner-core';

// Set external links
import './utilities/setExtLinks';
import './utilities/form-validation';

/**
 * Configure conditioner
 */
conditioner.addPlugin({
  // converts module aliases to paths
  moduleSetName: name => `${name}.js`,
  // get the module constructor
  moduleGetConstructor: module => module.default,
  // override the import
  moduleImport: name => import( // eslint-disable-line
    /* https://webpack.js.org/api/module-methods/#import- */
    /* set to "eager" to create a single chunk for all modules */
    /* set to "lazy" to create a separate chunk for each module */
    /* webpackChunkName: "[request]" */
    /* webpackMode: "lazy" */
    `./modules/${name}`),
});

conditioner.hydrate(document.documentElement);
