const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const slugify = require('slugify');

module.exports = class extends Generator {
  hello() {
    this.log(yosay(`Welcome to the ${chalk.rgb(244, 0, 77)('E-sites')} frontend generator!`));

    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname,
      },
      {
        type: 'input',
        name: 'source',
        message: 'Your source folder?',
        default: './source',
      },
      {
        type: 'input',
        name: 'webroot',
        message: 'Your web root folder?',
        default: './',
      },
      {
        type: 'input',
        name: 'build',
        message: 'Your build folder? (relative to web root)',
        default: 'build',
      },
    ]).then((answers) => {
      console.log(chalk.rgb(73, 166, 255)('The answers are correct! You go through for the fridge…'));

      /**
       * A little defensive coding against folders not properly set by the user
       */
      let webRootPath = answers.webroot;
      let buildfolder = answers.build;

      if (buildfolder.startsWith('./')) {
        buildfolder = buildfolder.replace('./', '');
      } else if (buildfolder.startsWith('/')) {
        buildfolder = buildfolder.substring(1);
      }

      if (webRootPath.startsWith('/')) {
        webRootPath = `.${webRootPath}`;
      } else if (!webRootPath.startsWith('./')) {
        webRootPath = `./${webRootPath}`;
      }

      if (!webRootPath.endsWith('/')) {
        webRootPath = `${webRootPath}/`;
      }

      /**
       * Store stuff for later use
       */
      this.projectName = answers.name;
      this.sourcePath = answers.source;
      this.webRootPath = webRootPath;
      this.buildFolder = buildfolder;
      this.buildPath = `${this.webRootPath}${this.buildFolder}`;
    });
  }

  writing() {
    console.log(chalk.rgb(244, 0, 77)('Writing files…'));

    this._writingGitkeeps();
    this._writingPackage();
    this._writingEditorConfig();
    this._writingBabel();
    this._writingEslintIgnore();
    this._writingEslint();
    this._writingGitignore();
    this._writingStylelint();
    this._writingGulptasks();
    this._writingWebpack();
    this._writingSource();
  }

  _writingGitkeeps() {
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.buildPath}/js/.gitkeep`)
    );
  }

  _writingPackage() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        name: slugify(this.projectName),
        projectName: this.projectName,
        sourcePath: this.sourcePath,
        buildFolder: this.buildFolder,
        webRootPath: this.webRootPath,
        buildPath: this.buildPath,
      }
    );
  }

  _writingEslintIgnore() {
    this.fs.copyTpl(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore'),
      {
        sourcePath: this.sourcePath,
        buildPath: this.buildPath,
      }
    );
  }

  _writingEditorConfig() {
    this.fs.copyTpl(
      this.templatePath('.editorconfig'),
      this.destinationPath('.editorconfig')
    );
  }

  _writingBabel() {
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc')
    );
  }

  _writingEslint() {
    this.fs.copyTpl(
      this.templatePath('.eslintrc'),
      this.destinationPath('.eslintrc')
    );
  }

  _writingGitignore() {
    this.fs.copyTpl(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore'),
      {
        sourcePath: this.sourcePath,
        buildPath: this.buildPath,
      }
    );
  }

  _writingStylelint() {
    this.fs.copyTpl(
      this.templatePath('.stylelintrc'),
      this.destinationPath('.stylelintrc')
    );
  }

  _writingGulptasks() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );

    this.fs.copy(
      this.templatePath('_tasks'),
      this.destinationPath('_tasks')
    );
  }

  _writingWebpack() {
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js')
    );
  }

  _writingSource() {
    this.fs.copy(
      this.templatePath('_source'),
      this.destinationPath(this.sourcePath)
    );
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install'],
    });
  }

  end() {
    this.log(yosay(`Whoop! We’re done! Run ${chalk.rgb(244, 0, 77)('npm run watch')} for development. Run ${chalk.rgb(244, 0, 77)('npm run build')} for a one time build.`));
  }
};
