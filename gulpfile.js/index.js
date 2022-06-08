const { task, src, dest, watch, series, parallel } = require('gulp');
const {paths} = require('./config.js');
const browserSync = require('browser-sync').create();
const del = require('del');
const rename = require('gulp-rename');
const ejs = require('gulp-ejs');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const runSequence = require('gulp4-run-sequence');
const noop = require("gulp-noop");
const args = require('yargs').argv;
const isProd = args.env === "prod";

task('open-browser', function(callback) {
  browserSync.init({
    server: {
        baseDir: paths.browser.baseDir,
        index: paths.browser.page,
    },
    port: paths.browser.port,
    open: true
  });
  callback
});
task('reload-browser', function(callback) {
  browserSync.reload();
  callback;
});
task('page-html', function() {
  return src(paths.entry.ejs)
  .pipe(ejs({ pageName: paths.entry.name, pageTitle: paths.entry.title, prod: isProd }))
  .pipe(rename({extname: '.html'}))
  .pipe(isProd ? htmlmin({removeComments: true}) : noop())
  .pipe(dest(paths.output.html))
});
task('page-scss', function(){
  return src(paths.entry.scss)
  .pipe(isProd ? noop() : sourcemaps.init())
  .pipe(postcss())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(isProd ? cleanCSS() : noop())
  .pipe(rename({extname: '.css'}))
  .pipe(isProd ? noop() : sourcemaps.write('./maps'))
  .pipe(dest(paths.output.css))
});
task('page-js', function(){
  return src(paths.entry.js)
  .pipe(dest(paths.output.js))
});
task('page-assets', function() {
  return src(paths.entry.assets)
  .pipe(dest(paths.output.assets))
});
task('commonTheme-scss', function(){
  return src(paths.entry.commonThemeCSS)
  .pipe(isProd ? noop() : sourcemaps.init())
  .pipe(postcss())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(isProd ? cleanCSS() : noop())
  .pipe(rename({extname: '.css'}))
  .pipe(isProd ? noop() : sourcemaps.write('./maps'))
  .pipe(dest(paths.output.commonThemeCSS))
});
task('clean-css', function(){
  return del(paths.output.css)  
});
task('clean-dist', function(){
  return del(paths.dist)  
});
task('compile-css', function(callback){
  watch(paths.watch.scss, function() {
    runSequence(
      'clean-css',
      'compile-scss',
      callback
    )
  });
});
task('build-css', function(callback){
    runSequence(
      'clean-css',
      'compile-scss',
      callback
    )
});
task('page:compile', function(callback) {
  runSequence(
      'page-html',
      'page-scss',
      'commonTheme-scss',
      'page-js',
      'page-assets',
      callback
  );
});
task('page:watch', function() {
  watch(paths.watch.ejs, function(callback) {
    runSequence(
        'page-html',
        'reload-browser',
        callback
      );
  });
  watch(paths.watch.scss, function(callback) {
    runSequence(
        'page-scss',
        'reload-browser',
        callback
      );
  });
  watch(paths.watch.assets, function(callback) {
    runSequence(
        'page-assets',
        'reload-browser',
        callback
      );
  });
  watch(paths.watch.js, function(callback) {
    runSequence(
        'page-js',
        'reload-browser',
        callback
      );
  });
});
task('page:dev', function(callback) {
  runSequence(
    'page:compile',
    ['open-browser','page:watch'],
    callback
  );
});
exports.dev = series('clean-dist', parallel('page:compile', 'open-browser','page:watch'));
exports.build = series('clean-dist', 'page:compile');






