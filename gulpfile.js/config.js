const fileName = 'home';
const pageName = `${fileName}-web.html`;
const src =  'src/';
const ejs = [src + `pages/${fileName}/*.ejs`];
const scss = src + `scss/${fileName}/*.scss`;
const commonThemeCSS = src + `scss/commonTheme/*.scss`;
const js = [src + `js/${fileName}.js`];
const assets = [src + `assets/${fileName}/**/*`];
const dist = 'dist/'

const PATHS = {
  entry: {
    name: fileName,
    ejs: ejs,
    title: `${fileName}`,
    scss: scss,
    commonThemeCSS: commonThemeCSS,
    js: js,
    assets: assets
  },
  output: {
    html: dist,
    css: dist + `css/${fileName}/`,
    js: dist + `js/${fileName}/`,
    assets: dist + `assets/${fileName}/`
  },
  browser: {
    baseDir: dist,
    page: pageName,
    port: 2500,
  },
  watch: {
    ejs: src + `pages/**/*`,
    scss: src + `scss/**/*`
  },
  dist: dist,
};

module.exports = {
  paths: PATHS,
};