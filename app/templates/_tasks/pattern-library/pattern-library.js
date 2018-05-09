/**
 * Compiles the main styles.scss file and creates a source-map
 */

const fs = require('fs');
const gulp = require('gulp');
const tasker = require('gulp-tasker');
const { exec } = require('child_process');

const { paths, patternlibrary } = require(`${process.cwd()}/gulp-config.js`);

const patternlib = (done) => {
  exec('php core/console --generate', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    done();
  });
};

// tasker.addTask('deploy', patternlib');
if (patternlibrary) {
  tasker.addTask('default', patternlib);
  tasker.addTask('watch', patternlib, `${paths.patterns}/**/*`);
}
