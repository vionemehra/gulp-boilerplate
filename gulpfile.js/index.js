const { task, src, dest, watch, series } = require('gulp');
const {paths, settings} = require('./config.js');
const cache = require("gulp-cached");
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

task('clear-cache', function(cb) {
  cache.caches = {};
  cb();
});

task('open-server', function() {
  browserSync.init({
    server: {
        baseDir: paths.browser.baseDir,
        index: paths.browser.page,
    },
    port: paths.browser.port,
    open: true
  });
});
task('reload-server', function(cb) {
  browserSync.reload();
  cb();
});
task('page-html', function(done) {

  if (!settings.ejs) return done();

  return src(paths.entry.ejs)
  .pipe(ejs({ pageName: paths.entry.name, pageTitle: paths.entry.title, prod: isProd }))
  .pipe(rename({extname: '.html'}))
  .pipe(isProd ? htmlmin({removeComments: true}) : noop())
  .pipe(dest(paths.output.html))
});
task('page-scss', function(done){

  if (!settings.scss) return done();

  return src(paths.entry.scss)
  .pipe(isProd ? noop() : sourcemaps.init())
  .pipe(postcss())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(isProd ? cleanCSS() : noop())
  .pipe(rename({extname: '.css'}))
  .pipe(isProd ? noop() : sourcemaps.write('./maps'))
  .pipe(dest(paths.output.css))
});
task('page-js', function(done){

  if (!settings.js) return done();
  
  return src(paths.entry.js)
  .pipe(dest(paths.output.js))
});
task('page-assets', function(done){

  if (!settings.assets) return done();
  
  return src(paths.entry.assets)
  .pipe(dest(paths.output.assets))
});
task('commonTheme-scss', function(done){

  if (!settings.commonTheme) return done();
  
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
task('compile-css', function(cb){
  watch(paths.watch.scss, function() {
    runSequence(
      'clean-css',
      'compile-scss',
      cb
    )
  });
});
task('build-css', function(cb){
    runSequence(
      'clean-css',
      'compile-scss',
      cb
    )
});
task('page:compile', function(cb) {
  runSequence(
    'clear-cache',
    'page-html',
    'page-scss',
    'commonTheme-scss',
    'page-js',
    'page-assets',
    cb
  );
});
task('page:watch', function() {
  watch(paths.watch.ejs, function(cb) {
    runSequence(
        'page-html',
        'reload-server',
        cb
      );
  });
  watch(paths.watch.scss, function(cb) {
    runSequence(
        'page-scss',
        'reload-server',
        cb
      );
  });
  watch(paths.watch.js, function(cb) {
    runSequence(
        'page-js',
        'reload-server',
        cb
      );
  });
  watch(paths.watch.assets, function(cb) {
    runSequence(
        'page-assets',
        'reload-server',
        cb
      );
  });
});
task('dev', function(cb) {
  runSequence(
    'page:compile',
    ['open-server', 'page:watch'],
    cb
  );
});
exports.build = series('clean-dist', 'page:compile');






