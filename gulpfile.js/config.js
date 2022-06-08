const fileName = 'home';
const pageName = `${fileName}-web.html`;
const src =  'src/';
const ejs = [src + `views/${fileName}/*.ejs`];
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
    assets: dist + `assets/${fileName}/`,
    commonThemeCSS:  dist + `css/commonTheme/`,
  },
  browser: {
    baseDir: dist,
    page: pageName,
    port: 2500,
  },
  watch: {
    ejs: src + `views/**/**/*.ejs`,
    scss: src + `scss/**/**/*.scss`,
    assets: src + `assets/**`,
    js: src + `js/**/*.js`
  },
  dist: dist,
};

const SETTINGS = {
  clean: true,
  ejs: true,
  scss: true,
  js: true,
  assets: true,
  commonTheme: true,
  reload: true
};

// module.exports = {
//   paths: PATHS,
// };

// module.exports = {
//   setting: SETTINGS,
// };

exports.paths = PATHS;
exports.settings = SETTINGS;