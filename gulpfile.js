/** ====== gulp配置表 ======
* 
*
**/
var gulp,
	exter,//外接模块对象
	cg,//模块配置
	rely;//调用依赖函数
	
	cg = {
		autoprefixer: 'gulp-autoprefixer',//加前缀
		minifycss: 'gulp-minify-css',//css压缩
		jshint: 'gulp-jshint',//js代码校验
		uglify: 'gulp-uglify',//js压缩
		imagemin: 'gulp-imagemin',//图片压缩
		rename: 'gulp-rename',//文件更名
		concat: 'gulp-concat',//文件合并
		cache: 'gulp-cache',//缓存
		notify: 'gulp-notify',//显示提示
		del: 'del',//清除文件
		md5: 'gulp-md5'
	};
	rely = function(mods){
		var o = {};
		for(var k in mods){
			o[k] = require(mods[k]);
		}
		return o;
	};
	gulp = require('gulp');
	exter = rely(cg);
	
	
	// Js
	gulp.task('js', function(){
		jsFile.contents
		.pipe(exter.jshint.reporter('default'))
		.pipe(exter.concat('online.js'))
		.pipe(gulp.dest('online/build/'))
		//.pipe(exter.rename({ suffix: '.min' }))
		.pipe(exter.md5(10))
		.pipe(exter.uglify())
		.pipe(gulp.dest('online/home/'))
		
		console.log(
		'history is -> '+jsFile.history +'\n'+ 
		'relative is -> '+jsFile.relative +'\n'+ 
		'dirname is -> '+jsFile.dirname +'\n'+
		'basename is -> '+jsFile.basename +'\n'+
		'stem is -> '+jsFile.stem +'\n'+
		'extname is -> '+jsFile.extname +'\n'+
		'path is -> '+jsFile.path +'\n'+
		'base is -> '+jsFile.base
		);
	});
	// Image
	gulp.task('image', function(){
		gulp.src('image/package/*')
		.pipe(exter.cache(exter.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
		.pipe(gulp.dest('image/home/'));
	});
	// Clean
	gulp.task('clean', function(){
		/*exter.del([
		'css/build/*',
		'css/home/*',
		'online/build/*',
		'online/home/*',
		'image/home/*'
		])*/
		//exter.del(['../../../../Work_git/ResFltIntlOnline/ResFltIntlOnline/Booking/online/home/mods.js'])
	});
	gulp.task('poi', function(){
		gulp.src('../../../../Work_git/ResFltIntlOnline/package/util/address_poi-2.0.src.js')
		.pipe(exter.uglify())
		.pipe(gulp.dest('online/home/'))
	});
	// Default task
	gulp.task('default', ['clean'], function(){
		gulp.start('poi');
	});
	// Watch
	gulp.task('watch', function(){
		// Watch .js files
		gulp.watch('online/*.js', function(event){
			console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
			gulp.start('default');
		});
	});