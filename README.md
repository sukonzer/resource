#资源文件 - 构建指南

开发环境配置:

1.安装 [nodejs](http://nodejs.org)

2.全局安装 `gulp`
```
npm install gulp -g(全局安装，gulp指令可用)
```

3.配置package.json
```
npm init
```

4.本地安装依赖
```
npm install --save-dev gulp webpack del jshint babel-core babel-loader babel-preset-env babel-preset-es2015 babel-plugin-transform-object-assign
```
<!--
安装Gulp插件
```
npm install --save-dev gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del jshint
```

sass的编译 (gulp-ruby-sass)

自动添加css前缀 (gulp-autoprefixer)

压缩css (gulp-minify-css)

合并js文件 (gulp-concat)

压缩js代码 (gulp-uglify)

压缩图片 (gulp-imagemin)

自动刷新页面 (gulp-livereload)

图片缓存,只有图片替换了才压缩 (gulp-cache)

更改提醒 (gulp-notify)

清除文件 (del)

js代码校验 (jshint)

[更多插件](http://gulpjs.com/plugins/)


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
-->
