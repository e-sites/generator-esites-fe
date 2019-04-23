const Generator = require('yeoman-generator');
const yosay = require('yosay');
const chalk = require('chalk');
const slugify = require('slugify');
const compareVersions = require('compare-versions');
const generatorConfig = require('../package.json');

module.exports = class extends Generator {
  hello() {
    this.log(
      yosay(
        `Welcome to the ${chalk.rgb(244, 0, 77)('E-sites')} frontend generator!`
      )
    );

    // We'll need this later, you'll never know
    this.run = true;
    this.upgrade = false;
    this.copyAssets = true;
    this.copyTasks = true;
    this.copyCmsStuff = true;

    // Get possible current config file from project
    const projectConfig = this.config.getAll();

    if (Object.keys(projectConfig).length && !('version' in projectConfig)) {
      this.log(
        yosay(
          `It seems that a ${chalk.rgb(244, 0, 77)(
            '.yo-rc.json'
          )} is present in the project. Some options are prefilled. Please check if they are correct.`
        )
      );
    }

    // Cache default prompts
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname,
        when: answers => ('upgrade' in answers ? answers.upgrade : true),
      },
      {
        type: 'confirm',
        name: 'cms',
        message: 'Are you scaffolding for a kunstmaan project?',
        default: projectConfig.cms,
        when: answers => ('upgrade' in answers ? answers.upgrade : true),
      },
      {
        type: 'input',
        name: 'source',
        message: 'Your source folder?',
        default: answers => {
          let string = './source';

          if (projectConfig.source) {
            string = projectConfig.source;
          } else if (answers.cms) {
            string = './src/Esites/WebsiteBundle/Resources/ui';
          }

          return string;
        },
        when: answers => ('upgrade' in answers ? answers.upgrade : true),
      },
      {
        type: 'input',
        name: 'webroot',
        message: 'Your web root folder?',
        default: answers => {
          let string = './';

          if (projectConfig.webroot) {
            string = projectConfig.webroot;
          } else if (answers.cms) {
            string = './web';
          }

          return string;
        },
        when: answers => ('upgrade' in answers ? answers.upgrade : true),
      },
      {
        type: 'input',
        name: 'build',
        message: 'Your build folder? (relative to web root)',
        default: answers => {
          let string = 'build';

          if (projectConfig.build) {
            string = projectConfig.build;
          } else if (answers.cms) {
            string = 'frontend';
          }

          return string;
        },
        when: answers => ('upgrade' in answers ? answers.upgrade : true),
      },
      {
        type: 'confirm',
        name: 'useTest',
        message: 'Do you want to copy the HTML test file?',
        default: projectConfig.useTest,
        when: answers => ('upgrade' in answers ? answers.upgrade : true),
      },
    ];

    /**
     * Check if there are settings logged in the cached config
     */
    if (Object.keys(projectConfig).length && 'version' in projectConfig) {
      const compare = compareVersions(
        generatorConfig.version,
        projectConfig.version
      );
      // check if current version is bigger than version of config
      if (compare >= 0) {
        // Prepend update prompt to promts
        prompts.unshift(
          {
            type: 'confirm',
            name: 'upgrade',
            message: `This project is already scaffolded with this generator
generator: ${projectConfig.version}
project: ${generatorConfig.version}
Are you sure you want to upgrade?`,
            default: false,
          },
          {
            type: 'checkbox',
            name: 'upgradeTypes',
            message: 'What do you want to upgrade?',
            choices: ['tasks', 'assets', 'cmsstuff'],
            default: ['tasks'],
            when: answers => ('upgrade' in answers ? answers.upgrade : true),
          }
        );
      }
    }

    /**
     * Actual prompt the user
     */
    return this.prompt(prompts).then(answers => {
      if ('upgrade' in answers) {
        this.run = answers.upgrade;
        this.upgrade = answers.upgrade;
      }

      if ('upgradeTypes' in answers) {
        this.copyTasks = answers.upgradeTypes.includes('tasks');
        this.copyAssets = answers.upgradeTypes.includes('assets');
        this.copyCmsStuff = answers.upgradeTypes.includes('cmsstuff');
      }

      if (this.run) {
        console.log(
          chalk.rgb(73, 166, 255)(
            'The answers are correct! You go through for the fridge…'
          )
        );

        /**
         * A little defensive coding against folders not properly set by the user
         */
        let webRootPath = answers.webroot;
        let buildfolder = answers.build;
        let sourcePath = answers.source;

        if (buildfolder.startsWith('./')) {
          buildfolder = buildfolder.replace('./', '');
        } else if (buildfolder.startsWith('/')) {
          buildfolder = buildfolder.substring(1);
        }

        if (sourcePath.startsWith('/')) {
          sourcePath = `.${sourcePath}`;
        } else if (!sourcePath.startsWith('./')) {
          sourcePath = `./${sourcePath}`;
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
          remove: /[$*_+~.()'"!:@]/g,
          lower: true,
        });
        this.sourcePath = sourcePath;
        this.webRootPath = webRootPath;
        this.buildFolder = buildfolder;
        this.buildPath = `${this.webRootPath}${this.buildFolder}`;
        this.useTest = answers.useTest;
        this.useCms = answers.cms;

        /**
         * Store answers in a `.yo-rc.json` for later use
         */
        this.config.set('version', generatorConfig.version);
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
          openPath: this.useTest ? 'test' : '',
        };
      }
    });
  }

  writing() {
    if (this.run) {
      if (this.useCms && this.copyCmsStuff) {
        this._writingCmsViews();
        this._writingCmsApp();
        this._writingCmsGitkeeps();
      }

      if (!this.useCms) {
        this._writingGitignore();
      }

      this._writingEditorConfig();
      this._writingBrowserslist();
      this._writingPackage();
      this._writingNvm();
      this._writingEslintIgnore();
      this._writingEslint();
      this._writingBabel();
      this._writingStylelint();

      if (this.copyTasks) {
        this._writingGulptasks();
        this._writingWebpack();
      }

      if (this.copyAssets) {
        this._writingSource();
      }

      if (this.useTest) {
        this._writingTest();
      }

      this._writingGitkeeps();
    }
  }

  _writingGitkeeps() {
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.buildPath}/.gitkeep`)
    );
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.sourcePath}/css/01-tools/functions/.gitkeep`)
    );
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.sourcePath}/css/02-generic/.gitkeep`)
    );
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.sourcePath}/css/04-objects/.gitkeep`)
    );
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(`${this.sourcePath}/css/06-utilities/.gitkeep`)
    );
  }

  _writingPackage() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.templateSettings
    );
  }

  _writingNvm() {
    this.fs.copyTpl(
      this.templatePath('.nvmrc'),
      this.destinationPath('.nvmrc')
    );
  }

  _writingBrowserslist() {
    this.fs.copyTpl(
      this.templatePath('.browserslistrc'),
      this.destinationPath('.browserslistrc')
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

    this.fs.copy(this.templatePath('_tasks'), this.destinationPath('tasks'));

    this.fs.copyTpl(
      this.templatePath('gulp-config.js'),
      this.destinationPath('gulp-config.js'),
      this.templateSettings
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

  /**
   * CMS stuff
   */

  _writingCmsViews() {
    this.fs.copy(
      this.templatePath('_cms/views'),
      this.destinationPath('./src/Esites/WebsiteBundle/Resources/views')
    );
  }

  _writingCmsApp() {
    this.fs.copy(this.templatePath('_cms/app'), this.destinationPath('./app'));
  }

  _writingCmsGitkeeps() {
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(
        './src/Esites/WebsiteBundle/Resources/views/Patterns/Atoms/.gitkeep'
      )
    );
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(
        './src/Esites/WebsiteBundle/Resources/views/Patterns/Molecules/.gitkeep'
      )
    );
    this.fs.copyTpl(
      this.templatePath('.gitkeep'),
      this.destinationPath(
        './src/Esites/WebsiteBundle/Resources/views/Patterns/Organisms/.gitkeep'
      )
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
      this.log(
        yosay(
          `${chalk.rgb(73, 166, 255)('Whoop! We’re done!')} Run ${chalk.rgb(244, 0, 77)('npm run start')} or ${chalk.rgb(244, 0, 77)('npm run serve')} for development. Run ${chalk.rgb(244, 0, 77)('npm run build')} for a one time build.` // prettier-ignore
        )
      );
    } else {
      this.log(
        yosay(
          `${chalk.rgb(73, 166, 255)('You aborted the upgrade')} Run ${chalk.rgb(244, 0, 77)('npm run start')} or ${chalk.rgb(244, 0, 77)('npm run serve')} for development. Run ${chalk.rgb(244, 0, 77)('npm run build')} for a one time build.` // prettier-ignore
        )
      );
    }
  }
};
