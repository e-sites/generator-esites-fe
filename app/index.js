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

      this.projectName = answers.name;
      this.sourcePath = answers.source;
      this.webRootPath = answers.webroot;
      this.buildFolder = answers.build;
      this.buildPath = `${this.webRootPath}${this.buildFolder}`;
    });
  }

  writing() {
    console.log(chalk.rgb(244, 0, 77)('Writing files…'));

    this._writingPackage();
    this._writingEditorConfig();
    this._writingBabel();
    this._writingEslintIgnore();
    this._writingEslint();
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
