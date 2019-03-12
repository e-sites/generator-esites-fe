/**
 * Compiles the main styles.scss file and creates a source-map
 */

const gulp = require('gulp');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const gulpif = require('gulp-if');
const del = require('del');
const tasker = require('gulp-tasker');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const { handleError, handleSuccess } = require('../base/handlers');

const { revisionFiles, paths } = require(`${process.cwd()}/gulp-config.js`);

const folder = paths.folders.css;

const debug = process.env.NODE_ENV !== 'production';

const cleancss = (done) => {
  del([`${paths.dist}/**/*.{css,css.map}`]);
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
    .pipe(gulpif(revisionFiles, rev()))
    .pipe(gulpif(debug, sourcemaps.write('./')))
    .pipe(gulp.dest(paths.dist))
    .pipe(gulpif(revisionFiles, rename({
      dirname: `${paths.public}`,
    })))
    .pipe(gulpif(
      revisionFiles,
      rev.manifest(`${paths.dist}/manifest.json`, {
        base: paths.public,
        merge: true,
        transformer: {
          stringify: (map) => {
            const cleanObject = {};
            const keys = Object.keys(map);

            keys.forEach((key) => {
              cleanObject[`${key.replace(`${paths.public}/`, '')}`] = `${map[key]}`;
            });

            return JSON.stringify(cleanObject, null, 2);
          },
          parse: map => JSON.parse(map),
        },
      })
    ))
    .pipe(gulpif(
      revisionFiles,
      gulp.dest(paths.public)
    ))
    .pipe(handleSuccess('sass', 'SASS compiling succeeded'));

const cssTask = gulp.series(cleancss, compilecss);

gulp.task('css', cssTask);

tasker.addTask('default', cssTask);
tasker.addTask('deploy', cssTask);
tasker.addTask('watch', cssTask, `${paths.source + folder}/**/*.scss`);
