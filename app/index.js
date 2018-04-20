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
        name: 'build',
        message: 'Your build folder?',
        default: './build',
      },
    ]).then((answers) => {
      console.log(chalk.rgb(73, 166, 255)('The answers are correct! You go through for the fridge…'));

      this.projectName = answers.name;
      this.sourceFolder = answers.source;
      this.buildFolder = answers.build;
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
      }
    );

    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.buildFolder}/.gitkeep`)
    );

    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.sourceFolder}/.gitkeep`)
    );
  }
};
