var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');

gulp.task('watch', function () {
    gulp.watch('public/sass/*.scss', ['compile']);
});

gulp.task('compile', function () {
    return gulp.src('public/sass/*.scss')
        .pipe(sass().on('error', function(err){console.log("Error Found: "+err.message)}))
        .pipe(gulp.dest('public/css/build/'));
});