# generator-esites-fe
Yeoman generator for E-sites projects

## Features
Please see our [Gulp tasks](https://github.com/e-sites/generator-esites-fe/tree/master/app/templates/_tasks) for up to date information on what we support.

- Asset management with [webpack](https://webpack.js.org/)
- [ITCSS](https://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528) CSS architecture
- Compile Sass with [libsass](http://libsass.org)
- Enable CSS plugins with [PostCSS](http://postcss.org/)
- CSS baseline by [Supple CSS](https://github.com/supple-css/supple)
- CSS Autoprefixing with [Autoprefixer](https://github.com/postcss/autoprefixer)
- ES2015+ features with [Babel](https://babeljs.io)
- [Conditioner.js](https://github.com/rikschennink/conditioner) - Frizz free, context-aware, JavaScript modules
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

**Note**: If you use this generator in a Kunstmaan project please check the [Kunstmaan CMS installation](#kunstmaan-cms-installation) guide.

## Usage
Please make sure your system meets the [prerequisites](#prerequisites).

- Run `npm update -g generator-esites-fe`.
- From the terminal, navigate to your projects directory.
- Type `yo esites-fe`, answer a few questions about your project, and wait.
- Bask in the glory of your fully scaffolded frontend installation.

## Options
- `--skip-install`
  Skips the automatic execution of `npm` after scaffolding has finished.

## Kunstmaan CMS installation
At E-sites we’re running a CMS called [Kunstmaan bundles for Symfony](https://bundles.kunstmaan.be/).

During installation of this front-end setup you’ll get the question "Are you scaffolding for a kunstmaan project?". If you choose `yes` we’re assuming you already have installed a clean Kunstmaan project through [the installation guide](https://kunstmaanbundlescms.readthedocs.io/en/latest/installation/).

By default Kunstmaan installs their own front-end tooling named `groundcontrol`.
It is advised to remove all groundcontrol files before running this yeoman generator to ensure you’ll have the most clean start point of your project.

Files & folders which you need to **remove**:

- `groundcontrol`
- `package.json`
- `package-lock.json`
- `.babelrc`
- `.eslintrc`
- `.jshintrc`
- `.nvmrc`
- `.stylelintrc`
- `gulpfile.babel.js`
- `src/Esites/WebsiteBundle/Resources/ui`

**Note**: It is recommended that you remove these files but if you don’t, dont worry! The generator will prompt you when there are conflicts on the files.

Files you need to **change**:

- `.gitignore`: change `web/frontend/*/*` to `web/frontend/**/*` & add `/_tmp`
- `app/config/config.yml`: add `- { resource: config_frontend.yml }` parameter to `imports`
- `app/config/config.yml`: remove the `framework.assets` parameter


## Contribute

See the [contributing docs](contributing.md).

## Licence

[MIT license](LICENSE)
