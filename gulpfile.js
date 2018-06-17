var gulp = require('gulp');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css-min', function() {
    return gulp
        .src('src/**/*.css')
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
    'watch'
]);