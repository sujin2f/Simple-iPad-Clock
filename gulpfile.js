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
const del = require('del');

const dest = './build';

const paths = {
  styles: {
    src: './src/assets/styles/sass/**/*.scss',
    dest: `${dest}/assets/css/`,
  },
  scripts: {
    src: './src/assets/scripts/**/*.js',
    dest: `${dest}/assets/scripts/`,
  },
  html: {
    src: './src/**/*.html',
    dest: `${dest}/`,
  },
};

const gulpSass = () => {
  return gulp.src(paths.styles.src)
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
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.')) // Creates sourcemaps for minified styles
    .pipe(gulp.dest(paths.styles.dest))
};

const gulpScripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel())
    .pipe(sourcemaps.init())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write('.')) // Creates sourcemap for minified JS
    .pipe(gulp.dest(paths.scripts.dest))

};

const gulpHtml = () => {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(paths.html.dest))
};

const clean = () => {
  return del([ dest ]);
};

const watch = () => {
  gulp.watch(paths.scripts.src, gulpScripts);
  gulp.watch(paths.styles.src, gulpSass);
  gulp.watch(paths.html.src, gulpHtml);
}

const build = gulp.series(clean, gulp.parallel(gulpSass, gulpScripts, gulpHtml));

gulp.task('build', build);
gulp.task('default', build);
gulp.task('watch', watch);
