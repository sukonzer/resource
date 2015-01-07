;(function($,online){
var usedRe={
	//tmpl regexp
	tmplMapString:/[\r\n\'\"\\]/g,
	tmplCheckVari:/(^|[^\.])\b([a-z_$][\w$]*)/gi,
	tmplParse:/^[\s\S]*?(?=(\$\{|\{\{))/,
	tmplKey_$:/^\$\{([\s\S]+)\}$/,
	tmplKey_cmd:/^\{\{\s*(if|else|\/if|\/?loop|\/?each|\/?enum|tmpl)\b.*\}\}$/,
	tmplKey_if:/^\{\{\s*if\s+(.+?)\s*\}\}$/,
	tmplKey_else:/^\{\{\s*else(\s+(.+?))?\s*\}\}$/,
	tmplKey_loop:/^\{\{\s*loop(\s*\(([^,\)]+)(,([^,\)]+))?\))?\s+(.+?)\s*\}\}$/,
	tmplKey_each:/^\{\{\s*each(\s*\(([^,\)]+)(,([^,\)]+))?(,([^,\)]+))?\))?\s+(.+?)\s*\}\}$/,
	tmplKey_enum:/^\{\{\s*enum(\s*\(([^,\)]+)(,([^,\)]+))?\))?\s+(.+?)\s*\}\}$/,
	tmplKey_tmpl:/^\{\{\s*tmpl\s+(.+?)(,([^,]+?))?\s*\}\}$/
};

$.tmpl={
	/**
	 * @cfg {object} 模板 [ 私有属性 ] 
	 */
	_tmpls:{},
	
	/**
	 * @cfg  {object} 模板引擎关键字 [ 私有属性 ]
	 */
	_keyword1:['break','delete','function','return','typeof','case','do','if','switch','var','catch','else','in','this','void','continue','false','instanceof','throw','while','debugger','finally','new','true','with','default','for','null','try'],
	
	/**
	 * @cfg  {object} 模板引擎关键字 [ 私有属性 ]
	 */
	_keyword2:['abstract','double','goto','native','static','boolean','enum','implements','package','super','byte','export','import','private','synchronized','char','extends','int','protected','throws','class','final','interface','public','transient','const','float','long','short','volatile'],
	
	/**
	 * @cfg  {object} 模板引擎关键字Hash表 [ 私有属性 ]
	 */
	_keywordHash:null,
	
	/**
	 * @cfg  {object} 转义字符对应表 [ 私有属性 ]
	 */
	_stringMap:{
		'\r':'\\r',
		'\n':'\\n',
		'"':'\\"',
		'\'':'\\\'',
		'\\':'\\\\'
	},
	
	/**
	 * @method _init
	 * [ 私有方法 ] 初始化模板引擎，关键字初始化等。
	 */
	_init:function(){
		if (this._keywordHash){
			return;
		}
		this._keywordHash={};
		for (var i=0,n=this._keyword1.length;i<n;i++){
			this._keywordHash[this._keyword1[i]]=true;
		}
		for (var i=0,n=this._keyword2.length;i<n;i++){
			this._keywordHash[this._keyword2[i]]=true;
		}
	},
	
	/**
	 * @method _mapString
	 * [ 私有方法 ] 初始化转义词
	 * @param {string} 需要转义的字符串
	 * @return {string} 转义完毕后的字符串
	 */
	_mapString:function(str){
		var map=this._stringMap;
		return str.replace(usedRe.tmplMapString,function(a){
			return map[a]||a;
		});
	},
	
	/**
	 * @method _parse
	 * [ 私有方法 ] 根据模板进行解析
	 * @param {string} 待解析的字符串
	 * @return {string} 解析完毕的字符串
	 */
	_parse:function(source){
		var arr=[],k=0,start;
		main:
			while (true){
				//find start
				start='';
				source=source.replace(usedRe.tmplParse,function(a,b){
					arr[k++]={
						type:'txt',
						value:a
					};
					start=b;
					return '';
				});
				if (!start){
					arr[k++]={
						type:'txt',
						value:source
					};
					break main;
				}
				//find end
				vari:
					if (start=='${'){
						var stack=1;
						for (var i=2,n=source.length;i<n;i++){
							var chr=source.substr(i,1);
							switch (chr){
								case '{':
									stack++;
									break;
								case '}':
									stack--;
									break;
							}
							if (!stack){
								arr[k++]={type:'vari',value:source.slice(0,i+1)};
								source=source.slice(i+1);
								break vari;
							}
						}
						arr[k++]={
							type:'txt',
							value:source
						};
						break main;
					}
				cmd:
					if (start=='{{'){
						var stack=2;
						for (var i=2,n=source.length;i<n;i++){
							var chr=source.substr(i,1);
							switch (chr){
								case '{':
									stack++;
									break;
								case '}':
									stack--;
									break;
							}
							if (!stack){
								arr[k++]={
									type:source.substr(i-1,1)=='}'?'cmd':'txt',
									value:source.slice(0,i+1)
								};
								source=source.slice(i+1);
								break cmd;
							}
						}
						arr[k++]={
							type:'txt',
							value:source
						};
						break main;
					}
			}
		return arr;
	},
	
	/**
	 * @method _checkVari
	 * [ 私有方法 ] 对没有定义过的变量名做容错处理
	 * @param {string} 字符串
	 * @return {string} 返回容错处理后的字符串
	 */
	_checkVari:function(){
		var arr=[],k=0,vari,hash=this._keywordHash;
		for (var i=0,n=arguments.length;i<n;i++){
			vari=arguments[i];
			vari.replace(usedRe.tmplCheckVari,function(a,b,c){
				if (!hash.hasOwnProperty(c)){
					arr[k++]='if (typeof '+c+'=="undefined") _undefined["'+c+'"]="";';
				}
			});
		}
		return arr.join('');
	},
	_splitVari:function(vari){
		var arr=[],k=0;
		var t=(vari+' ,').split('');
		var stack=[],start=0;
		for (var i=0,n=t.length;i<n;i++){
			if ((stack[0]=='"'||stack[0]=='\'')&&t[i]=='\\'){
				i++;
				continue;
			}
			switch (t[i]){
				case ',':
					if (!stack.length){
						arr[k++]=vari.slice(start,i).trim();
						start=i+1;
					}
					break;
				case '(':
				case '[':
				case '{':
					stack.unshift(t[i]);
					break;
				case ')':
					if (stack[0]=='('){
						stack.shift();
					}
					break;
				case ']':
					if (stack[0]=='['){
						stack.shift();
					}
					break;
				case '}':
					if (stack[0]=='{'){
						stack.shift();
					}
					break;
				case '"':
				case '\'':
					if (stack[0]==t[i]){
						stack.shift();
					}else{
						stack.unshift(t[i]);
					}
					break;
			}
		}
		return arr;
	},
	repeat:function(obj,times){
		var arr=[];
		arr[times]='';
		return arr.join(obj);
	},
	/**
	 * @method _makeFn
	 * [ 私有方法 ] 创建函数组
	 * @param {string} 模板
	 * @return {string}  返回函数
	 */
	_makeFn:function(tmpl){
		var stack=[],level=0;
		var fnArr=[],k=0;
		fnArr[k++]='var _o=[],_k=0,_undefined={};if(!$data){$data={};}if(!$opt){$opt={};}with(_undefined){with($opt){with($data){';
		var tmp='_undefined["#tmp"]';
		for (var i=0,n=tmpl.length;i<n;i++){
			switch (tmpl[i].type){
				case 'txt':
					fnArr[k++]='_o[_k++]="'+this._mapString(tmpl[i].value)+'";';
					break;
				case 'vari':
					var arr=tmpl[i].value.match(usedRe.tmplKey_$);
					var def=this._checkVari(arr[1]);
					fnArr[k++]=def+'_o[_k++]='+arr[1]+';';
					break;
				case 'cmd':
					var arr1=tmpl[i].value.match(usedRe.tmplKey_cmd);
					if (!arr1){
						break;
					}
					switch (arr1[1]){
						case 'if':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_if);
							stack[++level]=1;
							var def=this._checkVari(arr2[1]);
							fnArr[k++]=def+'try{'+tmp+'='+arr2[1]+';}catch($error){'+tmp+'=false;};if ('+tmp+'){';
							break;
						case 'else':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_else);
							if (arr2[1]){
								stack[level]++;
								var def=this._checkVari(arr2[2]);
								fnArr[k++]='}else{'+def+'try{'+tmp+'='+arr2[2]+';}catch($error){'+tmp+'=false;};'+'if ('+tmp+'){';
							}else
								fnArr[k++]='}else{';
							break;
						case '/if':
							fnArr[k++]=$.tmpl.repeat('}',stack[level--]);
							break;
						case 'loop':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_loop);
							var _i=arr2[2]||'$index',_l=arr2[4]||'$length',_n=arr2[5];
							var def=this._checkVari(_n);
							_n=this._splitVari(_n);
							switch (_n.length){
								case 1:
									_n=[0,_n[0],1];
									break;
								case 2:
									_n=[_n[0],_n[1],1];
									break;
							}
							var f;
							switch (_n[2]){
								case 0:
									_n[2]='';
									f='<';
									break;
								case 1:
									_n[2]='++';
									f='<';
									break;
								case -1:
									_n[2]='--';
									f='<';
									break;
								default:
									if (_n[2].toString().isFloat()){
										var t=parseFloat(_n[2],10);
										f=t>=0?'<':'>';
										_n[2]='+='+_n[2];
									}
									break;
							}
							if (f){
								fnArr[k++]=def+'(function(){for (var '+_i+'='+_n[0]+','+_l+'='+_n[1]+';'+_i+f+_l+';'+_i+_n[2]+'){';
							}else{
								fnArr[k++]=def+'(function(){for (var '+_i+'='+_n[0]+','+_l+'='+_n[1]+',$step='+_n[2]+';$step>=0^'+_i+'<'+_l+';'+_i+'+=$step){';
							}
							break;
						case '/loop':
							fnArr[k++]='}})();';
							break;
						case 'each': // each (index[,value[,length]]) vari
							var arr2=tmpl[i].value.match(usedRe.tmplKey_each);
							var _i=arr2[2]||'$index',_v=arr2[4]||'$value',_l=arr2[6]||'$length',_n=arr2[7];
							var def=this._checkVari(_n);
							fnArr[k++]=def+'(function(){for (var '+_i+'=0,'+_l+'=('+_n+').length;'+_i+'<'+_l+';'+_i+'++){var '+_v+'='+_n+'['+_i+'];with('+_v+'){';
							break;
						case '/each':
							fnArr[k++]='}}})();';
							break;
						case 'enum':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_enum);
							var _k=arr2[2]||'$key',_v=arr2[4]||'$value',_n=arr2[5];
							var def=this._checkVari(_n);
							fnArr[k++]=def+'(function(){for (var '+_k+' in '+_n+'){var '+_v+'='+_n+'['+_k+'];with('+_v+'){';
							break;
						case '/enum':
							fnArr[k++]='}}})();';
							break;
						case 'tmpl':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_tmpl);
							arr2[3]=arr2[3]||'$data';
							var def=this._checkVari(arr2[1],arr2[3]);
							fnArr[k++]=def+'_o[_k++]=$.tmpl.render('+arr2[1]+','+arr2[3]+');';
							break;
						default:
							break;
					}
					break;
				default:
					break;
			}
		}
		fnArr[k++]='}}} return _o.join("");';
		var fnStr=fnArr.join('');
		try{
			var fn=new Function('$data','$opt',fnStr);
		}catch (errA){
			online.log('tmpl._makefn','invalid source');
			online.log(errA);
			$.log('tmpl._makefn',fnStr);
			return $.COMMON_DONOTHING;
		}
		return fn;
	},
	
	/* strict for high performance render */
	_makeFnStrict:function(tmpl){
		var stack=[],level=0;
		var fnArr=[],k=0;
		fnArr[k++]='\
			var _o=[],_k=0;\
			if (!$data){\
				$data={};\
			}\
			if (!$opt){\
				$opt={};\
			}\
		';
		for (var i=0,n=tmpl.length;i<n;i++){
			switch (tmpl[i].type){
				case 'txt':
					fnArr[k++]='_o[_k++]="'+this._mapString(tmpl[i].value)+'";';
					break;
				case 'vari':
					var arr=tmpl[i].value.match(usedRe.tmplKey_$);
					fnArr[k++]='_o[_k++]='+arr[1]+';';
					break;
				case 'cmd':
					var arr1=tmpl[i].value.match(usedRe.tmplKey_cmd);
					if (!arr1){
						break;
					}
					switch (arr1[1]){
						case 'if':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_if);
							stack[++level]=1;
							fnArr[k++]='if ('+arr2[1]+'){';
							break;
						case 'else':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_else);
							if (arr2[1]){
								stack[level]++;
								fnArr[k++]='}else{ if ('+arr2[2]+'){';
							}else{
								fnArr[k++]='}else{';
							}
							break;
						case '/if':
							fnArr[k++]=$.tmpl.repeat('}',stack[level--]);
							break;
						case 'loop':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_loop);
							var _i=arr2[2]||'$index',_l=arr2[4]||'$length',_n=arr2[5];
							_n=this._splitVari(_n);
							switch (_n.length){
								case 1:
									_n=[0,_n[0],1];
								case 2:
									_n=[_n[0],_n[1],1];
							}
							var f;
							switch (_n[2]){
								case 0:
									_n[2]='';
									f='<';
									break;
								case 1:
									_n[2]='++';
									f='<';
									break;
								case -1:
									_n[2]='--';
									f='<';
									break;
								default:
									if (_n[2].toString().isFloat()){
										var t=parseFloat(_n[2],10);
										f=t>=0?'<':'>';
										_n[2]='+='+_n[2];
									}
									break;
							}
							if (f){
								fnArr[k++]='(function(){for (var '+_i+'='+_n[0]+','+_l+'='+_n[1]+';'+_i+f+_l+';'+_i+_n[2]+'){';
							}else{
								fnArr[k++]='(function(){for (var '+_i+'='+_n[0]+','+_l+'='+_n[1]+',$step='+_n[2]+';$step>=0^'+_i+'<'+_l+';'+_i+'+=$step){';
							}
							break;
						case '/loop':
							fnArr[k++]='}})();';
							break;
						case 'each': // each (index[,value[,length]]) vari
							var arr2=tmpl[i].value.match(usedRe.tmplKey_each);
							var _i=arr2[2]||'$index',_v=arr2[4]||'$value',_l=arr2[6]||'$length',_n=arr2[7];
							fnArr[k++]='(function(){for (var '+_i+'=0,'+_l+'=('+_n+').length;'+_i+'<'+_l+';'+_i+'++){var '+_v+'='+_n+'['+_i+'];';
							break;
						case '/each':
							fnArr[k++]='}})();';
							break;
						case 'enum':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_enum);
							var _k=arr2[2]||'$key',_v=arr2[4]||'$value',_n=arr2[5];
							fnArr[k++]='(function(){for (var '+_k+' in '+_n+'){var '+_v+'='+_n+'['+_k+'];';
							break;
						case '/enum':
							fnArr[k++]='}})();';
							break;
						case 'tmpl':
							var arr2=tmpl[i].value.match(usedRe.tmplKey_tmpl);
							arr2[3]=arr2[3]||'$data';
							fnArr[k++]='_o[_k++]=$.tmpl.renderStrict('+arr2[1]+','+arr2[3]+');';
							break;
						default:
							break;
					}
					break;
				default:
					break;
			}
		}
		fnArr[k++]='return _o.join("");';
		var fnStr=fnArr.join('');
		try{
			var fn=new Function('$data','$opt',fnStr);
		}catch (errA){
			online.log('tmpl._makeFnStrict','invalid source');
			online.log(errA);
			$.log('tmpl._makeFnStrict',fnStr);
			return $.COMMON_DONOTHING;
		}
		return fn;
	},
	_getCache:function(source){
		var t=this._tmpls[source];
		if (!t){
			t=this._tmpls[source]={
				source:source
			};
		}
		if (!t.tmpl){
			t.tmpl=this._parse(source);
		}
		return t;
	},

	/**
	 * @method render
	 * 根据模板渲染成结果
	 * @param {string} 模板的内容
	 * @param {string} 数据的内容
	 * @param {object} 配置项
	 * @return {string} 返回模板渲染之后的结果
	 */
	render:function(source,data,opt){
		this._init();
		var error=0;
		var t=this._getCache(source);
		if (!t.fn){
			t.fn=this._makeFn(t.tmpl);
		}
		try{
			var str=t.fn(data||{},opt||{});
		}catch(errA){
			online.log('tmpl.render',t.fn.toString().slice(0,200)+'...');
			return '';
		}
		return str;
	},

	renderStrict:function(source,data,opt){
		this._init();
		var error=0;
		var t=this._getCache(source);
		if (!t.fnStrict){
			t.fnStrict=this._makeFnStrict(t.tmpl);
		}
		try{
			var str=t.fnStrict(data||{},opt||{});
		}catch(errA){
			online.log('tmpl.renderStrict',t.fnStrict.toString().slice(0,200)+'...');
			return '';
		}
		return str;
	}

};
}(window.jQuery || window.Zepto,online));