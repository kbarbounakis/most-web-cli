/*eslint no-var: "off"*/
var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');
const child_process = require('child_process');

var modules = [
  'src/**/*.js'
];

function lint(files, options) {
  return function() {
    return gulp.src(files)
      .pipe(eslint(options))
      .pipe(eslint.format())
  };
}

function build(files) {
  return function () {
    return gulp.src(files, {
        base: './src'
    })
      .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist'));
  }
}

// test
gulp.task('build', ['lint'], build(modules));
//lint test
gulp.task('lint', lint(modules));

gulp.task('watch', ['build'], function () {
  gulp.watch(modules, function(file) {
    gutil.log(gutil.colors.green('Compiling ' + file.path));
    return build(file.path)();
  });
});

gulp.task('default', function() {
  gulp.start('build');
});