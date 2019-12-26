/*jshint strict:false, camelcase: false */

/**
 *  ===== NPM INSTALL =====
 *
 *  $ npm install gulp-cli -g
 *  $ npm install gulp gulp-util gulp-plumber gulp-rename gulp-notify gulp-uglify gulp-jshint jshint jshint-stylish --save-dev
 */

// Include gulp
var gulp = require('gulp'),

// Include plugins
gutil    = require('gulp-util'),
plumber  = require('gulp-plumber'),
rename   = require('gulp-rename'),
notify   = require('gulp-notify'),
uglify   = require('gulp-uglify'),
jshint   = require('gulp-jshint'),
pkg      = require('./package.json');


// Copyright
var _banner = [
    '/*!',
    ' * Angular jStore [v' + pkg.version + ']',
    ' * https://github.com/giovanniramos/angular-jstore',
    '',
    ' * Copyright (c) 2016-' + new Date().getFullYear() + ', ' + pkg.author.name,
    ' * Licensed under the MIT license:',
    ' *   http://opensource.org/licenses/MIT',
    ' */'
].join('\n');


// LINT
gulp.task('lint', function () {
    return gulp.src('src/angular-jstore.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish', { beep: true }))
        .pipe(jshint.reporter('fail'));
});


// PUBLISH
gulp.task('publish', function () {
    return gulp.src('src/angular-jstore.js')
        .pipe(plumber())
        .pipe(uglify({ output: { preamble: _banner, quote_style: 3 } }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist')) // compressed
        .pipe(notify({ message: 'Compression task is complete!' }))
        .on('error', gutil.log);
});