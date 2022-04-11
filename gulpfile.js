const gulp = require('gulp');
const themeKit = require('@shopify/themekit');
const sass = require('gulp-sass')(require('sass'));
const clean = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const sourcemaps = require('gulp-sourcemaps');
const zip = require('gulp-zip');
const del = require('del');
const copy = require('gulp-copy');


var supported = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 10',
    'ff >= 20',
    'ios 6',
    'android 4'
  ];

gulp.task('sass', function(){
    return gulp.src('scss/global.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano({
        autoprefixer: {browsers: supported, add: true},
        discardComments: {
          removeAll: true
        }
      }))  
    .pipe(clean({compatibility: 'ie11'}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('assets'))
});

gulp.task('sassProduction', function(){
  return gulp.src('scss/global.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(cssnano({
      autoprefixer: {browsers: supported, add: true},
      discardComments: {
        removeAll: true
      }
    }))  
  .pipe(clean({compatibility: 'ie11'}))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('assets'))
});

gulp.task('copy',  function(done){
  gulp.src([
    './**/*',
    '!./node_modules/**/*',
    '!./scss/**/*',
    '!./.gitignore',
    '!./config.yml',
    '!./gulpfile.js',
    '!./README.md',
    '!./package.json',
    '!./package-lock.json'
  ])
  .pipe(gulp.dest('production/src'))

  done();
});

gulp.task('zip',  function(done){
  gulp.src([
      './production/src/**/*'
  ])
		.pipe(zip('_shopify_theme.zip'))
		.pipe(gulp.dest('production'))
    done();
});

gulp.task('watch', function(){
    gulp.watch('scss/*.scss', gulp.series('sass'))
    themeKit.command('watch', {
        allowLive: true,
        env: 'development'
    })
});

gulp.task('del', function(done) {
  return del(['./production/src/node_modules', './production/src/scss']);
});


gulp.task('production', gulp.series('sassProduction','copy', 'del', 'zip'));

