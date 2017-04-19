/**
 * Created by ZHL on 2016/3/15.
 */
'use strict';
var gulp = require('gulp'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css');

gulp.task('font', function () {
    var fontName = 'eayunFont' + (new Date()).getTime();
    gulp.src('app/icons/*.svg')
        .pipe(iconfontCss({
            fontName: fontName,
            path: '_icons.css',
            targetPath: '../icons.css',
            fontPath: 'fonts/'
        }))
        .pipe(iconfont({
            fontName: fontName,
            formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
            normalize: true,
            fontHeight: 1001
        }))
        .pipe(gulp.dest('app/styles/fonts'));
});