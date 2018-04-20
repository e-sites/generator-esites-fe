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
      this.buildPath = `${this.webRootPath}/${this.buildFolder}`;
    });
  }

  // paths() {
  //   console.log(this.destinationRoot());

  //   console.log(this.destinationPath('index.js'));

  //   console.log(this.sourceRoot());

  //   console.log(this.templatePath('index.js'));
  // }

  writing() {
    console.log(chalk.rgb(244, 0, 77)('Writing files…'));

    // package.json
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

    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.buildPath}/.gitkeep`)
    );

    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.sourcePath}/.gitkeep`)
    );
  }
};
