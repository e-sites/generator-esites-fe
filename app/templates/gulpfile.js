// Gulp and some plugins that are used by multiple tasks
const gulp = require('gulp');
const tasker = require('gulp-tasker');

// Expose config
const { paths } = require('./gulp-config.js');

// Load all tasks
tasker.loadTasks({
  path: paths.tasks,
});

// Default task when run with 'gulp deploy'
gulp.task('deploy', gulp.series(tasker.getTasks('deploy').tasks));

// Default task when run with 'gulp'
gulp.task('default', gulp.series(tasker.getTasks('default').tasks));

// Sync task when run with 'gulp sync'
gulp.task('sync', gulp.series(tasker.getTasks('sync').tasks));

// Watch task when run with 'gulp watch'
gulp.task(
  'watch',
  gulp.series('default', () => {
    tasker.getTasks('watch').tasks.forEach((task) => {
      gulp.watch(task.folders, gulp.parallel(task.tasks));
    });
  })
);

gulp.task(
  'serve',
  gulp.series('sync', 'watch')
);
