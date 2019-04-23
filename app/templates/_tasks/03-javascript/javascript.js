/**
* Concats/minifies all JS files as defined in config.json under the 'build' key
 */

const gulp = require('gulp');
const del = require('del');
const tasker = require('gulp-tasker');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const notify = require('gulp-notify');
const notifier = require('node-notifier'); // eslint-disable-line
const webpackConfig = require('../../webpack.config.js');

const { paths } = require(`${process.cwd()}/gulp-config.js`);

const folder = paths.folders.js;

const clean = (done) => {
  del([`${paths.temp}/**/*.{js,map}`]);
  done();
};

const js = (allDone) => {
  const stream = webpackStream(webpackConfig, webpack);

  return stream
    .on('error', notify.onError(error => error))
    .pipe(gulp.dest(paths.temp))
    .on('close', () => {
      notifier.notify({
        title: 'js',
        message: 'Files written to disk',
      });
      allDone();
    });
};

const jsTask = gulp.series(clean, js);

gulp.task('js', jsTask);

tasker.addTask('default', jsTask);
tasker.addTask('watch', jsTask, [`${paths.source + folder}/**/*.js`]);
