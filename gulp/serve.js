/**
 * Created by ZHL on 2016/3/15.
 */
'use strict';
var gulp = require('gulp'),
    url = require('url'),
    proxy = require('proxy-middleware'),
    browserSync = require('browser-sync');

gulp.task('serve', ['inject', 'watch'], function () {
    //var proxyOptions = url.parse('http://10.10.10.237:8081/');
    var proxyOptions = url.parse('http://127.0.0.1:8080/');
    proxyOptions.route = '/api';

    browserSync.init({
        server: {
            baseDir: 'app',
            routes: {
                '/bower_components': 'bower_components'
            },
            middleware: [proxy(proxyOptions)]
        },
        port: 8080,
        host: 'localhost'
    });
    gulp.watch('app/**/*.html').on('change', browserSync.reload);
});