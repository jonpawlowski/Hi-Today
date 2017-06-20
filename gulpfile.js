var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var jadeCompiler = require('gulp-jade');

function swallowError(err) {
    //display detail error
    console.log(err.toString());
    //prevent the error crash the gulp watch;
    this.emit('end');
}

gulp.task('watch', function () {
    gulp.watch(['public/sass/*.scss', 'public/templates/**/*.jade'], ['compileStyle', 'compileTemplate']);
});

gulp.task('compileStyle', function () {
    return gulp.src('public/sass/**/*.scss')
        .pipe(sass().on('error', function(err){console.log("Error Found: "+err.message)}))
        .pipe(gulp.dest('public/css/build/'))
        .on('error', swallowError);
});

gulp.task('compileTemplate', function(){
    return gulp.src('public/templates/**/*.jade')
        .pipe(jadeCompiler())
        .pipe(gulp.dest('public/build-templates/'))
        .on('error', swallowError)
});