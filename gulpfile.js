var gulp = require('gulp');
var path = require('path');
var minifyCSS = require('gulp-csso');
var less = require('gulp-less');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css-min', function() {
    return gulp
        .src('src/**/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(minifyCSS())
        .pipe(concat('CoolRoadmap.min.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js-min', function() {
    return gulp
        .src('src/**/*.js')
        .pipe(concat('CoolRoadmap.min.js'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function() {
    return gulp.watch('src/**/*', ['build']);
})
  
gulp.task('build', [
    'css-min',
    'js-min'
]);
  
gulp.task('default', [
    'build',
    'watch'
]);