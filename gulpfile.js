var gulp = require("gulp");
var gulpMandrill = require("./index.js");

gulp.task('hello', function(){
    return gulp.src('Test.html')
        .pipe(gulpMandrill.render())

        .pipe(gulp.dest('output'));
});

