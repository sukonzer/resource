>pxbirdվ����Դ�ļ� ����ָ��.

������������:

��װ [nodejs](http://nodejs.org)

�ڰ�װ��� `nodejs` ֮��, �� `������ʾ��`, ִ�����в���

��װ `gulp`
```
npm install gulp -g(-gȫ�ְ�װ,������ĿҲ����ʹ��)
```

������package.json,Ȼ���ڿ�����Ŀ¼�ٰ�װһ��
```
npm install gulp --save-dev
```

��װGulp���
```
npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
```

sass�ı��� (gulp-ruby-sass)
�Զ����cssǰ׺ (gulp-autoprefixer)
ѹ��css (gulp-minify-css)
js����У�� (gulp-jshint)
�ϲ�js�ļ� (gulp-concat)
ѹ��js���� (gulp-uglify)
ѹ��ͼƬ (gulp-imagemin)
�Զ�ˢ��ҳ�� (gulp-livereload)
ͼƬ����,ֻ��ͼƬ�滻�˲�ѹ�� (gulp-cache)
�������� (gulp-notify)
����ļ� (del)
������,����http://gratimax.net/search-gulp-plugins/


��������������֮��,������gulpfile.js��Ϳ��Կ�ʼʹ��gulp������.

����Ŀ¼��������������Ҽ�
1.�Ƚ�node_modules��װ���̶�λ��(�����ĵ�λ��)
2.������Ĵ浽һ��reg���ļ���,���ü�����ӵ��Ҽ�
[HKEY_CLASSES_ROOT\Directory\Background\shell\ResOnline]
"Extended"=""

[HKEY_CLASSES_ROOT\Directory\Background\shell\ResOnline\command]
@="cmd.exe /s /c pushd \"%V\" && mklink /D node_modules \"E:\\npm\\ResOnline\\node_modules\""

ѹ��ָ��������Ҽ�
[HKEY_CLASSES_ROOT\Directory\Background\shell\gulp]
"Extended"=""

[HKEY_CLASSES_ROOT\Directory\Background\shell\gulp\command]
@="cmd.exe /s /c pushd \"%V\" && gulp --force && pause"


ģ�鿪��.

Ŀ¼�ṹ��
	--css			    [css�ļ���]
		--dependencies		ǿ����
		--package     		������
			--util 		�����
			--public	ҳ�漶����ģ��
			--action	ҳ�漶����
		--build			�ϲ�
		--home        		����ʹ��
	--image		      	    [image�ļ���]
		--package     		������
		--home        		����ʹ��
	--online		    [js��online�ļ���]
		--dependencies		ǿ����
		--package	    	����������Ŀ����Ŀ¼(��������Դ����)
			--config	�����ļ�
			--service	ҵ���
			--util		�����
			--data		���ݲ�
			--template	ģ��
			--public	ҳ�漶����ģ��
			--action	������(����ҳ�漶js���ÿ�)
		--build			�ϲ�
		--home        		����ʹ��
