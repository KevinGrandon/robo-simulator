var gulp = require('gulp');

var babel = require('gulp-babel');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var eslint = require('gulp-eslint');
var runSequence = require('run-sequence');
var webserver = require('gulp-webserver');

const SRC_ROOT = './src/';
const DIST_ROOT = './dist/';

const DEFAULT_PORT = 8000;
const DEFAULT_HOST = 'localhost';

/**
 * Runs the pre-commit hook.
 */
var failOnLint = false;
gulp.task('fail-lint', function(cb) {
  failOnLint = true;
  runSequence(['lint', 'babel'], cb);
});

/**
 * Runs linters on all javascript files found in the src dir.
 */
gulp.task('lint', function() {
  // Note: To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failOnError last.
  return gulp.src([
      SRC_ROOT + 'js/**/*.js',
      '!' + SRC_ROOT + 'js/ext/*.js',
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(failOnLint ? eslint.failOnError() : gutil.noop());
});

/**
 * Install pre-commit hook for app.
 */
gulp.task('pre-commit', function() {
  return gulp.src(['./pre-commit'])
    .pipe(gulp.dest('.git/hooks/'));
});


/**
 * Setup steps after an npm install.
 */
gulp.task('install', ['copy-web-app', 'pre-commit']);


/**
 * Copy all non-js directory app source/assets/components.
 */
gulp.task('copy-web-app', function() {
  return gulp.src([
      SRC_ROOT + '**',
      '!' + SRC_ROOT + 'js/*.js'
    ])
    .pipe(gulp.dest(DIST_ROOT));
});

/**
 * Converts javascript to es5. This allows us to use harmony classes and modules.
 */
gulp.task('babel', function() {
  var files = [
    SRC_ROOT + 'js/*.js',
    SRC_ROOT + 'js/**/*.js',
    '!' + SRC_ROOT + 'js/ext/*.js' // do not process external files
  ];
  try {
    return gulp.src(files)
      .pipe(process.env.PRODUCTION ? gutil.noop() : sourcemaps.init())
      .pipe(babel({
        modules: 'amd'
      }).on('error', function(e) {
        if (failOnLint) {
          throw e;
        } else {
          this.emit('end');
        }
      }))
      .pipe(process.env.PRODUCTION ? gutil.noop() : sourcemaps.write('.'))
      .pipe(gulp.dest(DIST_ROOT + 'js/'));

  } catch (e) {
    console.log('Got error in babel', e);
  }
});

/**
 * Build the app.
 */
gulp.task('build', function(cb) {
  runSequence(['clobber'], ['copy-web-app', 'babel', 'lint'], cb);
});


/**
 * Watch for changes on the file system, and rebuild if so.
 */
gulp.task('watch', function() {
  gulp.watch([SRC_ROOT + '**/*'], ['build']);
});


gulp.task('webserver', function() {
  return gulp.src(DIST_ROOT)
    .pipe(webserver({
      port: process.env.PORT || DEFAULT_PORT,
      host: process.env.HOST || DEFAULT_HOST,
      livereload: false,
      directoryListing: false,
      open: false
    }));
});


/**
 * The default task when `gulp` is run.
 * Adds a listener which will re-build on a file save.
 */
gulp.task('default', function() {
  runSequence('build', 'webserver', 'watch');
});

/**
 * Remove the distributable files.
 */
gulp.task('clobber', function(cb) {
  del('dist/**', cb);
});

/**
 * Cleans all created files by this gulpfile, and node_modules.
 */
gulp.task('clean', function(cb) {
  del([
    'dist/',
    'node_modules/'
  ], cb);
});
