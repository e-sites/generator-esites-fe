const gulp = require('gulp');
const rev = require('gulp-rev');
const gulpif = require('gulp-if');
const del = require('del');
const tasker = require('gulp-tasker');
const rename = require('gulp-rename');
const gulpDebug = require('gulp-debug');
const { handleError, handleSuccess } = require('../00-base/handlers');

const { revisionFiles, paths } = require(`${process.cwd()}/gulp-config.js`);

const clean = (done) => {
  del([
    `${paths.dist}/manifest.json`,
    `${paths.dist}/*.{css,css.map,js,js.map,svg}`,
  ]);
  done();
};

const compilemanifest = () =>
  gulp
    .src([`${paths.temp}/*.{css,js,svg}`])
    .pipe(gulpif(revisionFiles, gulpDebug({title: 'manifest:'})))
    .pipe(handleError('rev', 'Manifest compiling failed'))
    .pipe(gulpif(revisionFiles, rev()))
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
    .pipe(handleSuccess('rev', 'Revving completed'));


const manifestTask = gulp.series(clean, compilemanifest);

gulp.task('rev', manifestTask);

tasker.addTask('default', manifestTask);

tasker.addTask('watch', manifestTask, `${paths.temp}/*.{css,js,svg}`);
