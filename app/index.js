const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const slugify = require('slugify');
const compareVersions = require('compare-versions');
const packageJson = require('../package.json');

module.exports = class extends Generator {
  hello() {
    this.log(yosay(`Welcome to the ${chalk.rgb(244, 0, 77)('E-sites')} frontend generator!`));

    // We'll need this later, you'll never know
    this.run = true;

    // Get possible current config file from project
    const config = this.config.getAll();

    // Cache default prompts
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname,
        when: (answers) => {
          return ('upgrade' in answers) ? answers.upgrade : true;
        },
      },
      {
        type: 'input',
        name: 'source',
        message: 'Your source folder?',
        default: config.source ? config.source : './source',
        when: (answers) => {
          return ('upgrade' in answers) ? answers.upgrade : true;
        },
      },
      {
        type: 'input',
        name: 'webroot',
        message: 'Your web root folder?',
        default: config.webroot ? config.webroot : './',
        when: (answers) => {
          return ('upgrade' in answers) ? answers.upgrade : true;
        },
      },
      {
        type: 'input',
        name: 'build',
        message: 'Your build folder? (relative to web root)',
        default: config.build ? config.build : 'build',
        when: (answers) => {
          return ('upgrade' in answers) ? answers.upgrade : true;
        },
      },
      {
        type: 'confirm',
        name: 'useTest',
        message: 'Do you want to copy the HTML test file?',
        default: config.useTest,
        when: (answers) => {
          return ('upgrade' in answers) ? answers.upgrade : true;
        },
      },
    ];


    /**
     * Check if there are settings logged in the cached config
     */
    if (Object.keys(config).length) {
      const compare = compareVersions(packageJson.version, config.version);
      // check if current version is bigger than version of config
      if (compare >= 0) {
        // Prepend update prompt to promts
        prompts.unshift({
          type: 'confirm',
          name: 'upgrade',
          message: `Your version is lower or equal to the version you want to install (${config.version} < ${packageJson.version}). Are you sure you want to upgrade?`,
          default: false,
        })
      }
    }


    /**
     * Actual prompt the user
     */
    return this.prompt(prompts).then((answers) => {
      if ('upgrade' in answers) {
        this.run = answers.upgrade;
      }

      if (this.run) {
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
        this.projectName = slugify(answers.name, {
          remove: /[$*_+~.()'"!\:@]/g,
          lower: true,
        });
        this.sourcePath = answers.source;
        this.webRootPath = webRootPath;
        this.buildFolder = buildfolder;
        this.buildPath = `${this.webRootPath}${this.buildFolder}`;
        this.useTest = answers.useTest;


        /**
         * Store answers in a `.yo-rc.json` for later use
         */
        this.config.set('version', packageJson.version);
        this.config.set(answers);
        this.config.set('name', this.projectName);

        this.config.save();


        /**
         * Configure template settings for use in templated files
         */
        this.templateSettings = {
          name: this.projectName,
          projectName: this.projectName,
          sourcePath: this.sourcePath,
          buildFolder: this.buildFolder,
          webRootPath: this.webRootPath,
          buildPath: this.buildPath,
          openFolder: this.useTest ? 'test' : '',
        };
      }
    });
  }

  writing() {
    if (this.run) {
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

      if (this.useTest) {
        this._writingTest();
      }
    }
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
      this.templateSettings
    );
  }

  _writingEslintIgnore() {
    this.fs.copyTpl(
      this.templatePath('.eslintignore'),
      this.destinationPath('.eslintignore'),
      this.templateSettings
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
      this.templateSettings
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

  _writingTest() {
    this.fs.copyTpl(
      this.templatePath('_test/index.html'),
      this.destinationPath(`${this.webRootPath}/test/index.html`),
      this.templateSettings
    );
  }

  install() {
    if (this.run) {
      this.installDependencies({
        npm: true,
        bower: false,
        skipMessage: this.options['skip-install-message'],
        skipInstall: this.options['skip-install'],
      });
    }
  }

  end() {
    if (this.run) {
      this.log(yosay(`${chalk.rgb(73, 166, 255)('Whoop! We’re done!')} Run ${chalk.rgb(244, 0, 77)('npm run start')} for development. Run ${chalk.rgb(244, 0, 77)('npm run build')} for a one time build.`));
    } else {
      this.log(yosay(`${chalk.rgb(73, 166, 255)('You aborted the upgrade')} Run ${chalk.rgb(244, 0, 77)('npm run start')} for development. Run ${chalk.rgb(244, 0, 77)('npm run build')} for a one time build.`));
    }
  }
};
