// Reference:- https://gist.github.com/pgilad/11256601#file-gulpfile-js-L56
var _ = require("lodash");
var gulp = require('gulp');
var path = require('path');
var minify = require('gulp-minify-css');
var $gulp = require('gulp-load-plugins')({
    lazy: false
});
var protractor = require("gulp-protractor").protractor;
var templateCache = require('gulp-angular-templatecache');
var server = require('gulp-develop-server');
var ngAnnotate = require('gulp-ng-annotate');

var prependBowerPath = function (packageName) {
    return path.join('./client/bower_components/', packageName);
};
var vendorScripts = ['angular/angular.js',
               'angular-animate/angular-animate.js',
               'angular-ui-router/release/angular-ui-router.js',
               'angular-local-storage/dist/angular-local-storage.js',
               'lodash/dist/lodash.js',
               'restangular/dist/restangular.js',
               'angular-cookies/angular-cookies.js']
               .map(prependBowerPath);

var karmaScripts = _.union(vendorScripts, ['client/bower_components/angular-mocks/angular-mocks.js', 'client/app/**/*.js', 'client/app/**/*.html'])
console.log(karmaScripts);

var appScripts = ['client/app/**/*.js', '!client/app/**/*spec.js'];

gulp.task('clean', ['clean:js', 'clean:css']);

gulp.task('jshint', function () {
    return gulp.src(appScripts)
        .pipe($gulp.jshint())
        .pipe($gulp.jshint.reporter('default'));

});


gulp.task('set-env:test', function () {
    return $gulp.env({
        vars: {
            NODE_ENV: 'test'
        }
    });
});

gulp.task('karma', ['set-env:test'], function() {
    // Be sure to return the stream
    return gulp.src(karmaScripts)
        .pipe($gulp.using())
        .pipe($gulp.karma({
            configFile: 'karma.conf.js',
            action: 'watch'
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        });
});

gulp.task('protractor', ['set-env:test'], function () {
    server.listen({ env: { NODE_ENV: 'test'}, path: 'server/app.js'});
    return gulp.src(["./tests/e2e/PageObjects/*.js", "./tests/e2e/**/*e2e.spec.js"])
        .pipe($gulp.using())
        .pipe(protractor({
            configFile: "protractor.config.js"
        }));
});

gulp.task('test:server', ['set-env:test'], function() {
    "use strict";
    return gulp.src('server/**/*.spec.js')
        .pipe($gulp.mocha({reporter: 'spec'}))
        .on('error', $gulp.util.log);
});

gulp.task('test:server:watch', function() {
    "use strict";
    gulp.start('test:server');
    gulp.watch([ 'server/**/*.js', 'tests/server/**/*spec.js'], ['test:server']);
});

gulp.task('tests', ['karma', 'test:server:watch']);

gulp.task('clean:js', function () {
    return gulp.src(['./build/js'], {read: false})
        .pipe($gulp.rimraf());
});
gulp.task('clean:css', function () {
    return gulp.src(['./build/css'], {read: false})
        .pipe($gulp.rimraf());
});

gulp.task('css', ['clean:css'], function () {
    return gulp.src(['client/app/styles/app.less'])
        .pipe($gulp.less())
        .pipe($gulp.autoprefixer())
        .pipe(minify())
        .pipe($gulp.rev())
        .pipe(gulp.dest('build/css/'))
        .pipe($gulp.size({showFiles: true}));
});

gulp.task('vendors:js', ['clean:js'], function () {
    return gulp.src(vendorScripts)
        .pipe($gulp.using())
        .pipe($gulp.uglify())
        .pipe($gulp.concat('vendors.min.js'))
        .pipe($gulp.rev())
        .pipe(gulp.dest('build/js/'))
        .pipe($gulp.size({showFiles: true}));
});

gulp.task('js', ['clean:js', 'jshint'], function () {
    return gulp.src(appScripts)
        .pipe($gulp.using())
        .pipe(ngAnnotate())
        /*.pipe($gulp.uglify())*/
        .pipe($gulp.concat('app.min.js'))
        .pipe($gulp.rev())

        .pipe(gulp.dest('build/js/'))
        .pipe($gulp.size({showFiles: true}));
});

gulp.task('templates', ['clean:js'], function () {
    return gulp.src('client/app/**/*.html')
        .pipe($gulp.using())
        .pipe(templateCache({ module: 'HousePointsApp' }))
        .pipe(ngAnnotate())
        .pipe($gulp.uglify())
        .pipe($gulp.rev())
        .pipe(gulp.dest('build/js'));
});


gulp.task('server:start', ['build'], function() {
    "use strict";
    server.listen({path: 'server/app.js'}, $gulp.livereload.listen);
});

// restart server if app.js changed
gulp.task('watch', function () {
    gulp.watch([ 'server/**/*.js', 'client/app/**/*', 'client/index.html' ], ['server:restart']);
});

// restart server if app.js changed
gulp.task('server:restart', ['build'], function () {
    function restart() {
        server.changed( function( error ) {
            if( ! error ) $gulp.livereload.changed();
        });
    }
    restart();
});

gulp.task('html', ['css', 'vendors:js', 'js', 'templates'], function () {
    return gulp.src('./client/index.html')
        .pipe($gulp.inject(gulp.src(['./build/css/app*'], { read: false }), {
            addRootSlash: false,
            ignorePath: 'build'
        }))
        .pipe($gulp.inject(gulp.src(['./build/js/vendors*'], { read: false }), {
            addRootSlash: false,
            ignorePath: 'build', name: 'jsvendors'
        }))
        .pipe($gulp.inject(gulp.src(['./build/js/templates*'], { read: false }), {
            addRootSlash: false,
            ignorePath: 'build', name: 'templates'
        }))
        .pipe($gulp.inject(gulp.src(['./build/js/app*'], { read: false }), {
            addRootSlash: false,
            ignorePath: 'build', name: 'app'
        }))
        .pipe($gulp.htmlmin({collapseWhitespace: true, removeComments: true }))
        .pipe(gulp.dest('./build/'))
        .pipe($gulp.size({showFiles: true}));
});

gulp.task('build', ['html']);

gulp.task('default', ['build', 'server:start', 'watch']);