/**
 * Created by ZHL on 2016/3/15.
 */
'use strict';
var gulp = require('gulp');
gulp.task('watch', ['inject'], function () {
    gulp.watch('bower.json', ['bower']);
    gulp.watch('app/**/*.css', ['inject:css']);
    gulp.watch('app/**/*.js', ['inject:js']);
});