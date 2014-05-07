var gulp = require('gulp');
var traceur = require('gulp-traceur');
var replace = require('gulp-replace');
var concat = require('gulp-concat');

var allJsFiles = 'src/**/*.js';
var jsChallengeFiles = 'src/challenges/**/*.js';
var jsAppFiles = ['src/**/*.js', '!' + jsChallengeFiles, '!src/app.concat.js'];
var htmlFiles = 'src/**/*.html';

var publicSrcUrl = 'http://robianmcd.github.io/the-sandbox-challenge/src/';

gulp.task('buildHtml', function() {
    gulp.src(htmlFiles)
        .pipe(replace(publicSrcUrl, '../../../'))
        .pipe(replace('</body>', '<script src="challenge.js"></script>\n</body>'))
        .pipe(gulp.dest('dist'));
});

gulp.task('buildJs', function() {
    gulp.src(jsAppFiles)
        .pipe(replace(publicSrcUrl, '../../../'))
        .pipe(concat('app.concat.js'))
        .pipe(gulp.dest('src'))
        .pipe(gulp.dest('dist'));

    gulp.src(jsChallengeFiles)
        .pipe(replace(publicSrcUrl, '../../../'))
        .pipe(traceur({sourceMaps: true, experimental: true}))
        .pipe(gulp.dest('dist/challenges'));
});

gulp.task('buildAll', ['buildJs', 'buildHtml']);

gulp.task('default', ['buildAll'], function() {
    gulp.watch(allJsFiles, ['buildJs']);
    gulp.watch(htmlFiles, ['buildHtml']);
});
