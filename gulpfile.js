const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const plumber = require('gulp-plumber');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const htmlmin = require('gulp-htmlmin');

const srcScss = [
  './src/assets/styles/sass/**/*.scss',
];

const srcJs = [
  './src/assets/scripts/**/*.js',
];

const srcHTML = [
  './src/**/*.html',
];

gulp.task('scss', function() {
  return gulp.src(srcScss[0])
    .pipe(plumber(function(error) {
      gutil.log(gutil.colors.red(error.message));
      this.emit('end');
    }))
    .pipe(sourcemaps.init()) // Start Sourcemaps
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./build/assets/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.')) // Creates sourcemaps for minified styles
    .pipe(gulp.dest('./build/assets/css/'))
});

gulp.task('scripts', function() {
  return gulp.src(srcJs)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(sourcemaps.init())
//     .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./build/assets/scripts'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.')) // Creates sourcemap for minified JS
    .pipe(gulp.dest('./build/assets/scripts'))
});

gulp.task('html', function() {
  return gulp.src(srcHTML)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest('./build/'))
});

gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch(srcScss, gulp.series('scss'));

  // Watch .scss files
  gulp.watch(srcJs, gulp.series('scripts'));

  // Watch .html files
  gulp.watch(srcHTML, gulp.series('html'));
});

// Run styles, site-js and foundation-js
gulp.task('default', function() {
  gulp.start('scss', 'scripts', 'html');
});
