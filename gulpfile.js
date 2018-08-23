const gulp = require('gulp')
const sass = require('gulp-sass')
const autoPrefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync')
const connectPhp = require('gulp-connect-php')
const obfuscate = require('gulp-javascript-obfuscator')
// const babel = require('gulp-babel')
// const webpack = require('webpack-stream')

let config = {
  src: './resources/assets/scss/**/*.scss',
  dest: './public/css',
  bsConfig: {
    proxy: 'localhost:8001',
    port: 8001,
    open: true,
    notify: true
  } ,
  phpConfig: {
    base: './public',
    port: 8001,
    keepalive: true
  }
}

gulp.task('minify' , () => {
  gulp.src(config.src)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoPrefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dest))
})

gulp.task('sass' , () =>
  gulp.src(config.src)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoPrefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(config.dest))
)

gulp.task('serve' , () => {
  browserSync.init(config.bsConfig)
})

gulp.task('php' , () => {
  connectPhp.server(config.phpConfig)
})

gulp.task('obfuscate' , function() {
  return gulp.src('./storage/app/word-up.js')
    .pipe(obfuscate({
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      debugProtection: false,
      debugProtectionInterval: false,
      disableConsoleOutput: true,
      rotateStringArray: true,
      selfDefending: true,
      stringArray: true,
      stringArrayEncoding: 'base64',
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false
    }))
    .pipe(gulp.dest('./public/js/games'))
})

gulp.task('build' , () => {
  return gulp.src(config.src)
            .pipe(sass({outputStyle: 'compressed'}))
            .pipe(autoPrefixer())
            .pipe(gulp.dest(config.dest))
})

// uncomment if use babel
// gulp.task('babel' , () => {
//   return gulp.src('./resources/assets/js/games/**/*.jsx')
//               .pipe(babel({
//                   presets: ['es2015'] ,
//                   plugins: ['transform-react-jsx']
//               }))
//               .pipe(gulp.dest('./public/js/games/'))
// })

gulp.task('watch' , () => {
  
  // uncomment if use babel
  // gulp.watch('./resources/assets/js/games/**/*.jsx' , ['babel'])
  
  gulp.watch(config.src , ['sass'])
  gulp.watch('./resources/views/**/*.php').on('change' , browserSync.reload)
  gulp.watch('./public/css/**/*.css').on('change' , browserSync.reload)
  gulp.watch('./public/js/**/*.js').on('change' , browserSync.reload)
})

// uncomment if use babel
// gulp.task('default' , ['serve' , 'sass' , 'php' , 'babel' , 'watch'])

gulp.task('default' , ['serve' , 'sass' , 'php' , 'watch'])
