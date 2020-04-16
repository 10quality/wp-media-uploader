/**
 * Gulp
 * @author 10 Quality Studio <https://www.10quality.com/>
 * @version 1.0.0
 * @license MIT
 */

'use strict';

// Prepare
var gulp = require('gulp');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');

// ----- TASKS

// Minified version
gulp.task('jsmin', function() {
    return gulp.src('./src/**/*.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

// Copy fill
gulp.task('copy', function() {
    return gulp.src('./src/**/*.js')
        .pipe(gulp.dest('./dist/'));
});

// Default
gulp.task( 'default', gulp.parallel([
    'jsmin',
    'copy',
]));