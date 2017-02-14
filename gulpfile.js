/**
 * Created by medna on 06/02/2017.
 */
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var ngAnnotate   = require('gulp-ng-annotate');
var runSequence  = require('run-sequence');
var browserSync  = require('browser-sync');

gulp.task('main', function(){
    return gulp.src([
        './public/app/*.js','./public/app/**/*.js'])
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify({ mangle: false }))
        .pipe(uglify())
        .pipe(gulp.dest('./public/build/'))
});


gulp.task('serve', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('build', [], function() {
    runSequence('main');
});

gulp.task('default', ['build'], function() {});