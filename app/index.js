const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  hello() {
    this.log('Hello world!');
  }
};
