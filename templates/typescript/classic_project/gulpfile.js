/* eslint-disable */
const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');
const config = require('./.themost-cli.json');
const path = require('path');
// clean build directory
// read more at https://github.com/peter-vilja/gulp-clean
gulp.task('clean', function () {
    // validate that output path is not absolute
    if (path.isAbsolute(config.out)) {
        throw 'Output directory cannot be an absolute path.';
    }
    // validate that output path is under process.cwd()
    if (path.relative(process.cwd(), config.out).startsWith('..')) {
        throw 'Output directory must be under to process cwd.';
    }
    return gulp.src(config.out, { read: false, allowEmpty: true})
        .pipe(clean());
});
// copy project files
// read more at https://github.com/gulpjs/gulp
gulp.task('copy-files', function () {
    return gulp.src([
        path.join(config.base,'**/*'),
        '!' + path.join(config.base,'**/*.ts')
    ])
        .pipe(gulp.dest(config.out));
});
// build typescript
// read more at https://github.com/ivogabe/gulp-typescript
gulp.task('build-typescript', function () {
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.out));
});

const build = gulp.series('clean', 'copy-files', 'build-typescript');

module.exports = {
    build
};
