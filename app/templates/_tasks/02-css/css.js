/**
 * Compiles the main styles.scss file and creates a source-map
 */

const gulp = require('gulp');
const gulpif = require('gulp-if');
const del = require('del');
const tasker = require('gulp-tasker');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const { handleError, handleSuccess } = require('../00-base/handlers');

const { paths } = require(`${process.cwd()}/gulp-config.js`);

const folder = paths.folders.css;

const debug = process.env.NODE_ENV !== 'production';

const cleancss = (done) => {
  del([`${paths.temp}/**/*.{css,css.map}`]);
  done();
};

const compilecss = () =>
  gulp
    .src([`${paths.source + folder}/*.scss`])
    .pipe(handleError('sass', 'SASS compiling failed'))
    .pipe(gulpif(debug, sourcemaps.init()))
    .pipe(sass({
      precision: 8,
      includePaths: [
        './node_modules',
      ],
    }).on('error', sass.logError))
    .pipe(cleanCSS({
      level: debug ? 0 : 2,
    }))
    .pipe(autoprefixer())
    .pipe(gulpif(debug, sourcemaps.write('./')))
    .pipe(gulp.dest(paths.temp))
    .pipe(handleSuccess('sass', 'SASS compiling succeeded'));

const cssTask = gulp.series(cleancss, compilecss);

gulp.task('css', cssTask);

tasker.addTask('default', cssTask);
tasker.addTask('deploy', cssTask);
tasker.addTask('watch', cssTask, `${paths.source + folder}/**/*.scss`);