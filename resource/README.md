#站点资源文件 构建指南.

开发环境配置:

安装 [nodejs](http://nodejs.org)

在安装完成 `nodejs` 之后, 打开 `命令提示符`, 执行下列操作

安装 `gulp`
```
npm install gulp -g(-g全局安装,其它项目也可以使用)
```

先配置package.json,然后在开发根目录再安装一次
```
npm install gulp --save-dev
```

安装Gulp插件
```
npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
```

sass的编译 (gulp-ruby-sass)

自动添加css前缀 (gulp-autoprefixer)

压缩css (gulp-minify-css)

js代码校验 (gulp-jshint)

合并js文件 (gulp-concat)

压缩js代码 (gulp-uglify)

压缩图片 (gulp-imagemin)

自动刷新页面 (gulp-livereload)

图片缓存,只有图片替换了才压缩 (gulp-cache)

更改提醒 (gulp-notify)

清除文件 (del)

[更多插件](http://gratimax.net/search-gulp-plugins/)


在完成上面的配置之后,再配置gulpfile.js后就可以开始使用gulp构建了.

创建目录符号链接添加至右键

1.先将node_modules安装至固定位置(不更改的位置)

2.把下面的存到一个reg的文件中,启用即可添加到右键
```
[HKEY_CLASSES_ROOT\Directory\Background\shell\ResOnline]
"Extended"=""
```

```
[HKEY_CLASSES_ROOT\Directory\Background\shell\ResOnline\command]
@="cmd.exe /s /c pushd \"%V\" && mklink /D node_modules \"E:\\npm\\ResOnline\\node_modules\""
```

压缩指令添加至右键
```
[HKEY_CLASSES_ROOT\Directory\Background\shell\gulp]
"Extended"=""
```
```
[HKEY_CLASSES_ROOT\Directory\Background\shell\gulp\command]
@="cmd.exe /s /c pushd \"%V\" && gulp --force && pause"
```


模块开发.

目录结构：
```
--css			    [css文件夹]
	--dependencies		强依赖
	--package     		开发用
		--util 		组件集
		--public	页面级公共模块
		--action	页面级调用
	--build			合并
	--home        		线上使用
--image		      	    [image文件夹]
	--package     		开发用
	--home        		线上使用
--online		    [js的online文件夹]
	--dependencies		强依赖
	--package	    	开发包，项目所在目录(包含所有源代码)
		--config	配置文件
		--service	业务层
		--util		组件集
		--data		数据层
		--template	模板
		--public	页面级公共模块
		--action	控制器(所有页面级js调用块)
	--build			合并
	--home        		线上使用
```
