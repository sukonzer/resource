// Load plugins
var gulp = require('gulp'),
    // sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    // livereload = require('gulp-livereload'),
    del = require('del');
// Copy
gulp.task('copy',function(){
	gulp.src('online/dependencies/*')//强依赖
	.pipe(gulp.dest('online/home/'));
});

// Css
gulp.task('css', function() {
	function task(resource,combine){
		gulp.src(resource)
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat(combine))
		.pipe(gulp.dest('css/build/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('css/home/'))
		.pipe(notify({ message: 'css task complete' }));
	}
	var config = {
		'bootstrap.css':[
			'css/package/bootstrap-3.3.4.src.css',
			'css/package/bootstrap-theme-3.3.4.src.css'
		],
		'login.css':'css/package/action/login.css',
		'home.css':'css/package/action/home.css',
		'list.css':'css/package/action/list.css'
	};
	for(var p in config){
		task(config[p],p);
	}
});

// Js
gulp.task('js', function() {
	function task(resource,combine){
		gulp.src(resource)
		.pipe(jshint.reporter('default'))
		.pipe(concat(combine))
		.pipe(gulp.dest('online/build/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('online/home/'))
		.pipe(notify({ message: 'js task complete' }));
	}
	var config = {
		'zepto.js':'online/package/zepto-1.1.6.src.js',
		'jquery.js':'online/package/jquery-1.10.2.src.js',
		'mod.js':[
			'online/online.js',
			'online/package/util/tmpl/tmpl.js'
		],
		'login.js':'online/package/action/login.js',
		'home.js':'online/package/action/home.js',
		'list.js':[
			'online/package/util/dialog.js',
			'online/package/action/list.js'
		]
	};
	for(var p in config){
		task(config[p],p);
	}
});
// Image
gulp.task('image', function() {
	gulp.src('image/package/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('image/home/'))
    .pipe(notify({ message: 'image task complete' }));
});
// Clean
gulp.task('clean', function(cb) {
    del([
	'css/build/*',
	'css/home/*',
	'online/build/*',
	'online/home/*',
	'image/home/*'
	], cb)
});
// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('copy', 'css', 'js', 'image');
});
// Watch
gulp.task('watch', function() {
  // Watch .css files
  gulp.watch('css/package/*.css', ['css']);
  // Watch .js files
  gulp.watch('online/package/*.js', ['js']);
  // Watch image files
  gulp.watch('image/package/*', ['image']);
  // Create LiveReload server
  // livereload.listen();
  // Watch any files in dist/, reload on change
  // gulp.watch(['dist/**']).on('change', livereload.changed);
});