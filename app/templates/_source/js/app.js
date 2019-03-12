/*!
 * Application JS module entry file
 * Only imports here
 *
 * @author: E-sites <frontend@e-sites.nl>
 */

/**
 * Add ES5/6/7 polyfills
 * NOTE: Dont forget to add them to the `vendor` entry in `gulp-config.js`
 */
import 'core-js/web/dom-collections';
import 'core-js/es6/object';
import 'core-js/es6/array';
import 'core-js/es6/promise';
import 'core-js/stage/4';
import 'element-closest';
import 'svgxuse';


/**
 * Import our own handy dandy utilities
 */
import './utilities/conditioner';
import './utilities/setExtLinks';
import './utilities/form-validation';
