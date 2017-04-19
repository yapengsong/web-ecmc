/**
 * Created by ZHL on 2016/3/31.
 */
'use strict';
var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    rev = require('gulp-rev'),
    del = require('del'),
    annotate = require('gulp-ng-annotate'),
    sourceMaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    templateCache = require('gulp-angular-templatecache'),
    inject = require('gulp-inject'),
    runSequence = require('run-sequence');

gulp.task('usemin', function () {
    return gulp.src(['app/index.html','.tmp/'])
        .pipe(usemin({
            css: [minifyCss(), rev()],
            js: [sourceMaps.init(), uglify(), rev(), sourceMaps.write('maps/')],
            appjs: [sourceMaps.init(), annotate(), uglify(), rev(), sourceMaps.write('maps/')]
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function (done) {
    return del(['dist/','.tmp/'], done);
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe(gulp.dest('dist/images'));
});

gulp.task('favicon', function () {
    return gulp.src('app/favicon.ico')
        .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function () {
    return gulp.src('app/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('partials', function () {
    return gulp.src('app/**/*.html')
        .pipe(templateCache('templates.js',{
            module:'eayun.ecmc'
        }))
        .pipe(rev())
        .pipe(gulp.dest('dist/'));
});


gulp.task('html',['partials'], function () {
    return gulp.src('app/index.html')
        .pipe(inject(gulp.src('dist/templates*.js', {read: false}), {
            starttag: '<!-- inject:partials -->',
            ignorePath: 'dist',
            addRootSlash: false
        }))
        .pipe(gulp.dest('app'));
});

gulp.task('fonts',function(){
    return gulp.src('app/styles/fonts/*')
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('build', ['inject'], function (callback) {
    runSequence('clean', ['html', 'images','fonts','favicon'], 'usemin', callback);
});
