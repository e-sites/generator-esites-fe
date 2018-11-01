/**
 * Does SVG stuff :)
 */

const gulp = require('gulp');
const rev = require('gulp-rev');
const tasker = require('gulp-tasker');
const gulpif = require('gulp-if');
const { handleError, handleSuccess } = require('../base/handlers');
const del = require('del');
const svgstore = require('gulp-svgstore');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');

const { revisionFiles, paths } = require(`${process.cwd()}/gulp-config.js`);

const folder = paths.folders.svg;

const cleansvg = (done) => {
  del([`${paths.dist}/**/*.svg`]);
  done();
};

const copySVGS = () =>
  gulp
    .src(`${paths.source + paths.folders.svg}/**/*`)
    .pipe(gulp.dest(`${paths.dist + paths.folders.svg}`))
    .pipe(handleSuccess('copySVGS', 'SVG copying succeeded'));

const svgconcat = () =>
  gulp
    .src(`${paths.source + folder}/**/*.svg`)
    .pipe(svgstore())
    .pipe(handleError('svgconcat', 'SVG concatenation failed'))
    .pipe(imagemin([
      imagemin.svgo({
        plugins: [
          {
            removeTitle: true,
          },
          {
            removeDesc: true,
          },
          {
            removeUselessDefs: false,
          },
          {
            cleanupIDs: false,
          },
        ],
      }),
    ]))
    .pipe(handleError('svgconcat', 'SVG concatenation failed'))
    .pipe(rename('dist.svg'))
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
    .pipe(handleSuccess('svgconcat', 'SVG concatenation succeeded'));

const svgTaskDirty = gulp.series(cleansvg, copySVGS, svgconcat);
const svgTask = gulp.series(cleansvg, copySVGS, svgconcat);

gulp.task('svg', svgTask);

tasker.addTask('default', svgTask);
tasker.addTask('deploy', svgTask);
tasker.addTask('watch', svgTaskDirty, `${paths.source + folder}/**/*.svg`);
