'use strict'
// npm i --save-dev gulp gulp-watch gulp-sass gulp-sourcemaps gulp-concat gulp-changed browser-sync gulp-if gulp-filter del gulp-connect ngrok
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    changed = require('gulp-changed'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    gulpif = require('gulp-if'),
    filter = require('gulp-filter'),
    del = require('del'),
    connect = require('gulp-connect'),
    ngrok = require('ngrok');


gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: './'
    },
    notify: false,
  })

})

//
// gulp.task('concat', function () {
//   return gulp  .pipe(concat('script.js'))
//             .pipe(gulp.dest('../public/js/'))
//             .pipe(connect.reload())
//             // .pipe(browserSync.reload({stream: true}))
// })


gulp.task('tunnel', function () {
  ngrok.connect({
    proto: 'http', // http|tcp|tls
    addr: 3000,
  },function (err, url) {
    console.log(url); // get url of proxyServer (external temporary url to local site)
  });
});

gulp.task('sass', function () {
  return gulp.src('./scss/style.scss')
            .pipe(maps.init())
            .pipe(sass({
              style: 'compressed',
              errLogToConsole: false,
              onError: function(err) {
                  return notify().write(err);
              }
            }))
            .pipe(maps.write())
            .pipe(gulp.dest('./css'))
            .pipe(connect.reload())
});

gulp.task('js', function () {
    return gulp.src('./js/**/*')
    // .pipe(gulp.dest('./js'))
    .pipe(connect.reload())
});


gulp.task('connect', function(){
	connect.server({
		root: './',
		livereload: true,
    port: 3000
		})
})


//
// gulp.task('jade', function () {
//   return gulp.src(['jade/*.jade'])
//             .pipe(changed('../public', {extension: '.html'}))
//             .pipe(jade({
//               pretty: true
//             }))
//             .pipe(gulp.dest('../public/'))
//             .pipe(connect.reload())
// })




gulp.task('default', ['connect', 'sass', 'js', 'tunnel'], function () {

  gulp.watch('scss/*.scss', ['sass']).on('change',connect.reload);
  gulp.watch('js/**/*',['js']).on('change',connect.reload);
});
