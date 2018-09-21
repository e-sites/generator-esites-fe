/**
 * Copies/optmizes images to frontend dir
 */

const gulp = require('gulp');
const fs = require('fs');
const tasker = require('gulp-tasker');
const { handleSuccess } = require('../base/handlers');

const { paths, copyAssets } = require(`${process.cwd()}/gulp-config.js`);

const copyImages = () =>
  gulp
    .src(`${paths.source + paths.folders.images}/**/*`)
    .pipe(gulp.dest(`${paths.dist + paths.folders.images}`))
    .pipe(handleSuccess('copyImages', 'Image copying succeeded'));

const copyFonts = () =>
  gulp
    .src(`${paths.source + paths.folders.fonts}/*`)
    .pipe(gulp.dest(`${paths.dist + paths.folders.fonts}`))
    .pipe(handleSuccess('copyFonts', 'Font copying succeeded'));

const copyTask = gulp.parallel(copyImages, copyFonts);

if (copyAssets) {
  gulp.task('copy', copyTask);

  tasker.addTask('default', copyTask);
  tasker.addTask('watch', copyImages, `${paths.source + paths.folders.images}/**/*`);
  tasker.addTask('watch', copyFonts, `${paths.source + paths.folders.fonts}/**/*`);
}