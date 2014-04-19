var gulp = require('gulp');
var traceur = require('gulp-traceur');
var replace = require('gulp-replace');

var allJsFiles = 'src/**/*.js';
var jsEs6Files = 'src/**/challenge.js';
var jsEs5Files = ['src/**/*.js', '!' + jsEs6Files];
var htmlFiles = 'src/**/*.html';

var publicSrcUrl = 'http://robianmcd.github.io/learn-es-6/src/';

gulp.task('buildHtml', function() {
    gulp.src(htmlFiles)
        .pipe(replace(publicSrcUrl, '../../'))
        .pipe(replace('</body>', '<script src="challenge.js"></script>\n</body>'))
        .pipe(gulp.dest('dist'));
});

gulp.task('buildJs', function() {
    gulp.src(jsEs5Files)
        .pipe(replace(publicSrcUrl, '../../'))
        .pipe(gulp.dest('dist'));

    gulp.src(jsEs6Files)
        .pipe(replace(publicSrcUrl, '../../'))
        .pipe(traceur({sourceMaps: true, experimental: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('buildAll', ['buildJs', 'buildHtml']);

gulp.task('default', ['buildAll'], function() {
    gulp.watch(allJsFiles, ['buildJs']);
    gulp.watch(htmlFiles, ['buildHtml']);
});
