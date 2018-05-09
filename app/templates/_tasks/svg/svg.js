/**
 * Does SVG stuff :)
 */

const fs = require('fs');
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

const debug = process.env.NODE_ENV !== 'production';

const cleansvg = (done) => {
  del([`${paths.dist + folder}/*`]);
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
    .pipe(gulpif(revisionFiles && !debug, rev()))
    .pipe(gulp.dest(paths.dist + folder))
    .pipe(gulpif(
      revisionFiles && !debug,
      rev.manifest({
        merge: true,
        path: 'manifest.json',
        transformer: {
          stringify: (map) => {
            const keys = Object.keys(map);

            keys.map((key) => {
              map[`${paths.public + folder}/${key}`] = `/${paths.public + folder}/${map[key]}`;
              delete map[key];
              return key;
            });

            return JSON.stringify(map);
          },
        },
      })
    ))
    .pipe(gulpif(revisionFiles && !debug, gulp.dest(paths.dist + folder)))
    .pipe(handleSuccess('svgconcat', 'SVG concatenation succeeded'));

const svgTaskDirty = gulp.series(copySVGS, svgconcat);
const svgTask = gulp.series(cleansvg, copySVGS, svgconcat);

gulp.task('svg', svgTask);

tasker.addTask('default', svgTask);
tasker.addTask('deploy', svgTask);
tasker.addTask('watch', svgTaskDirty, `${paths.source + folder}/**/*.svg`);
