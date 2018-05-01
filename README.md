# generator-esites-fe
Yeoman generator for E-sites projects

## Features
Please see our [Gulp tasks](https://github.com/e-sites/generator-esites-fe/tree/master/app/templates/_tasks) for up to date information on what we support.

- Running tasks with [Gulp 4](https://github.com/gulpjs/gulp)
- [ITCSS](https://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528) CSS architecture
- Compile Sass with [libsass](http://libsass.org)
- Enable CSS plugins with [PostCSS](http://postcss.org/)
- CSS Autoprefixing with [Autoprefixer](https://github.com/postcss/autoprefixer)
- Javascript management with [webpack-encore](https://github.com/symfony/webpack-encore)
- ES2015+ features with [Babel](https://babeljs.io)
- [Conditioner.js](https://github.com/rikschennink/conditioner) - Frizz free, context-aware, JavaScript modules
- Asset versioning with [gulp-rev](https://github.com/sindresorhus/gulp-rev)
- SVG polyfill to enable external SVG's in IE10/IE11 with [svgxuse](https://github.com/Keyamoon/svgxuse)

## Prerequisites
Make sure Node and npm are installed. A great guide can be found here: [https://docs.npmjs.com/getting-started/installing-node](https://docs.npmjs.com/getting-started/installing-node)

First you need to install [Yeoman](http://yeoman.io/):

```bash
npm install -g yo
```

After that you'll need to install the generator:
```bash
npm install -g generator-esites-fe
```

If you already have these packages installed, you can upgrade them:
```bash
npm update -g yo generator-esites-fe
```

**Note**: Mac users need to run above commands with `sudo`.

## Usage
Please make sure your system meets the [prerequisites](#prerequisites).

- Run `npm update -g generator-esites-fe`.
- From the terminal, navigate to your projects directory.
- Type `yo esites-fe`, answer a few questions about your project, and wait.
- Bask in the glory of your fully scaffolded frontend installation.

## Options
- `--skip-install`
  Skips the automatic execution of `npm` after scaffolding has finished.

## Contribute

See the [contributing docs](contributing.md).

## Licence

[MIT license](LICENSE)
