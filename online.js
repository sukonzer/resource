;(function(w){
	var online = online || {};
	online.config = {
		dev: 'localhost',
		uat: 'test.localhost'
	}
	online.debug = new RegExp(online.config.dev,'i').test(location.host);

	online.extend = function(){
		var arg = arguments,
			target = arg.length === 1 ? this : arg[0],
			source = arg.length > 1 ? arg[1] : arg[0];
		if(source === null) return target;
		try{
			for (var p in source) {
				if(!target.hasOwnProperty(source[p])){
					switch(typeof(target)){
						case 'object':
							target[p] = source[p];
							break;
						case 'function':
							target.prototype[p] = source[p];
							break;
					}
				}
			}
			return target;
		}catch(ex){}
	};

	online.extend({

		//console封装(logType为打印日志类型[ps：warn，info，time]；msg为文本信息)
		log: function( logType , msg ){
			if(!this.debug || !w.console){
				return;
			}
			try{
				//存在打印类型就输出到控制台
				if(w.console[logType]){
					w.console[logType](msg);
				}else{
					//不存在打印类型(形参个数>1，提示logType写错；形参个数===1，直接输出到控制台)
					if(arguments.length>1){
						w.console.log('logType undefined -→ '+'%c'+arguments[0],'color:red');
					}else if(arguments.length === 1){
						w.console.log(arguments[0]);
					}
				}
			}catch(ex){}
		},
		//获取页面编码
		charset: (function(){
			var charset = (document.charset || document.characterSet).toLowerCase();
			if(charset === 'gbk'){
				charset = 'gb2312';
			}
			return charset;
		})(),
		//获取主域名url
		getHost: (function(){
			if(location.origin){
				return location.origin;
			}
			return location.protocol+'//'+location.host;
		})(),
		//获取站点所在根目录url
		getSite: function( url ){
			var secDir = location.href.split('/')[3] || '';
			url = url || '';
			if(secDir.indexOf('.') != -1 || location.hash){
				return '/'+ url;
			}
			return ('/' + secDir + '/').replace('//', '/') + url;
		},
		//获取浏览器类型和版本
		browser: (function(){
			var matched,browser;
			matched = (function() {
				ua = navigator.userAgent.toLowerCase();

				var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
					/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
					/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
					/(msie) ([\w.]+)/.exec( ua ) ||
					ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
					[];

				return {
					browser: match[ 1 ] || "",
					version: match[ 2 ] || "0"
				};
			})();
			browser = {};

			if ( matched.browser ) {
				browser[ matched.browser ] = true;
				browser.version = matched.version;
			}

			//区分Chrome和Safari, 两者内核均为Webkit
			if ( browser.chrome ) {
				browser.webkit = true;
			} else if ( browser.webkit ) {
				browser.safari = true;
			}
			return browser;
		})(),
		//解析url地址
		parseUrl: function(url){
			var a = document.createElement('a');
			a.href = url;
			return {
				source: url,
				protocol: a.protocol,
				host: a.hostname,
				port: a.port,
				query: a.search,
				params: (function(){
					var ret = {},
					seg = a.search.replace(/^\?/,'').split('&'),
					len = seg.length, i = 0, s;
					for (;i<len;i++) {
						if (!seg[i]) { continue; }
						s = seg[i].split('=');
						ret[s[0]] = s[1];
					}
					return ret;
				})(),
				file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
				hash: a.hash,
				path: a.pathname.replace(/^([^\/])/,'/$1'),
				relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
				segments: a.pathname.replace(/^\//,'').split('/')
			};
		}

	});
	
	//把onine暴露给window
	w.ol = online;
})(window);