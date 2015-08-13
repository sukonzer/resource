/*
*	Author: jvan
*	Email: 75863154@qq.com
*/
;(function(w){
	//创建online对象
	var online = online || {};
	
	//debug开关
	online.debug = /localhost/.test(location.host);

	//判断对象类型
	online.typeis = function( obj ){
	    var Class = Object.prototype.toString.call(obj).slice(8,-1).toLocaleLowerCase();
	    return obj !== undefined && obj !== null && Class;
	};
	//扩展方法
	online.extend = function(){
		var arg = arguments,
			target = arg.length === 1 ? this : arg[0],
			source = arg.length > 1 ? arg[1] : arg[0];
		if(source === null) return target;
		try{
			for(var p in source){
				if(!target.hasOwnProperty(source[p])){
					switch(this.typeis(target)){
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

	//给online对象上扩展一些常用属性和方法
	online.extend({
		//常用正则表达式
		reg: {
			//判断整数
			isInt:/^-?([1-9]\d*)?\d$/,
			//判断浮点数
			isFloat:/^-?(([1-9]\d*)?\d(\.\d*)?|\.\d+)$/,
			//判断是日期 (yyyy-mm-dd) 的格式
			isDate:/^(\d{4})-(\d{1,2})-(\d{1,2})$/,
			//判断是时间 (yyyy-mm-dd h:m:s.ms) 的格式
			isDateTime:/^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})(\.\d+)?$/,
			//转换成 (yyyy-mm-dd) 的格式
			toDate:/^(\d{4})-(\d{1,2})-(\d{1,2})( \d{1,2}:\d{1,2}:\d{1,2}(\.\d+)?)?$/,
			//转换成 (yyyy-mm-dd h:m:s.ms) 的格式
			toDateTime:/^(\d{4})-(\d{1,2})-(\d{1,2})( (\d{1,2}):(\d{1,2}):(\d{1,2})(\.\d+)?)?$/,
			//格式化成字符串
			toFormatString:/([yMdhmsS])\1*/g
		},
		/**
		* @method log
		* 打印日志
		* @param {string} 打印对象的名称
		* @param {string} 打印日志信息
		* @param {string} 打印日志类型[eg：warn，info，time]
		*/
		log: function( name,msg,logType ){
			if(!this.debug || !w.console){
				return;
			}
			try{
				var logMsg;
				if(arguments.length === 1){
					logMsg = name;
				}else if(arguments.length >=2){
					logMsg = '[ '+name+' ] '+ msg;
				}
				logType = logType || 'log';
				if(w.console[logType]){
					logMsg && w.console[logType](logMsg);
				}
			}catch(ex){}
		},
		//获取event
		getEvent: function(event){
	        return event || window.event;
	    },
	    //获取target
	    getTarget: function(event){
	        return event.target || event.srcElement;
	    },
	    //阻止默认行为
	    preventDefault: function(event){
	        if(event.preventDefault){
	        	event.preventDefault();
	        }else{
	            event.returnValue = false;
	        }
	    },
	    //阻止冒泡
	    stopPropagation: function(event){
	        if(event.stopPropagation){
	        	event.stopPropagation();
	        }else{
	        	event.cancelBubble = true;
	        }
	    },
	    //注册事件
		addHandler: function(element, type, handler){
			if(element.addEventListener){
				element.addEventListener(type, handler, false);
			}else if(element.attachEvent){
				element.attachEvent("on" + type, handler);
			}else{
				element["on" + type] = handler;
			}
		},
		//移除事件
		removeHandler: function(element, type, handler){
			if(element.removeEventListener){
				element.removeEventListener(type, handler, false);
			}else if(element.detachEvent){
				element.detachEvent("on" + type, handler);
			}else{
				element["on" + type] = null;
			}
		},
		//获取页面编码
		charset: (function(){
			var charset = (document.charset || document.characterSet).toLowerCase();
			if(charset === 'gbk'){
				charset = 'gb2312';
			}
			return charset;
		}()),
		//获取浏览器类型和版本
		browser: (function(){
			var matched,browser;
			matched = (function() {
				var ua = navigator.userAgent.toLowerCase();

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
		}()),
		//检测css3属性支持情况
		getStyleName: (function(){
			var prefixes = ['', '-ms-','-moz-', '-webkit-', '-khtml-', '-o-'],
				reg_cap = /-([a-z])/g;

			return function(css, el){
				el = el || document.documentElement;
				var style = el.style,test;
				for (var i=0, l=prefixes.length; i < l; i++) {
					test = (prefixes[i] + css).replace(reg_cap, function($0,$1){ return $1.toLocaleUpperCase();});
					if(test in style){
						return test;
					}
				}
				return null;
			};
		}()),
		//阻止滚动条滚动
		disableScroll: function(){
			var keys = [37, 38, 39, 40];
			function wheel(e){
				var e = e || window.event;
				online.preventDefault(e);
			}
			function keydown(e){
				var e = e || window.event;
				for(var i = keys.length; i--;){
					if (e.keyCode === keys[i]){
						online.preventDefault(e);
						return;
					}
				}
			}
			if(window.addEventListener){
				window.addEventListener('DOMMouseScroll', wheel, false);
			}
			window.onmousewheel = document.onmousewheel = wheel;
			document.onkeydown = keydown;	
		},
		//恢复滚动条滚动
		ableScroll: function(){
			function wheel(e){
				var e = e || window.event;
				online.preventDefault(e);
			}
			if(window.addEventListener){
				window.addEventListener('DOMMouseScroll', wheel, false);
			}
			window.onmousewheel = document.onmousewheel = document.onkeydown = null;
		},
		//获取坐标位置
		getClient: function(e){
			if(e.pageX && e.pageY){
				return{
					x: e.pageX,
					y: e.pageY
				};
			}

			return{
				x: e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - document.documentElement.clientLeft,
				y: e.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - document.documentElement.clientTop
			};
		},
		//调用高级浏览器全屏
		fullScreen: {
			is: function(){
				return document.fullscreen ||
					   document.webkitIsFullScreen ||
					   document.mozFullScreen ||
					   document.msFullScreen ||
					   false
				;
			},
			enabled: function(){
				var docNode = document.documentElement;
				return ( 'requestFullscreen' in docNode ) ||
					   ( 'msRequestFullscreen' in docNode ) ||
					   ( 'webkitRequestFullScreen' in docNode ) ||
					   ( 'mozRequestFullScreen' in docNode && document.mozFullScreenEnabled ) ||
					   false
				;
			},
			toggle: function(){
				var docNode = document.documentElement;
				if (
				   !this.is()
				){
					if(docNode.requestFullscreen){
						docNode.requestFullscreen();
					}else if(docNode.msRequestFullscreen){
						docNode.msRequestFullscreen();
					}else if(docNode.mozRequestFullScreen){
						docNode.mozRequestFullScreen();
					}else if(docNode.webkitRequestFullscreen){
						docNode.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
					}
				}else{
					if(document.exitFullscreen){
						document.exitFullscreen();
					}else if(document.msExitFullscreen){
						document.msExitFullscreen();
					}else if(document.mozCancelFullScreen){
						document.mozCancelFullScreen();
					}else if(document.webkitExitFullscreen){
						document.webkitExitFullscreen();
					}
				}
			}
		},
		//解析url地址
		parseUrl: function(url){
			var a = document.createElement('a');
			url = url || location.href; 
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
		},
		//是闰月
		isLeapMonth: function(year) {
		   return year%100==0? (year%400==0?1:0): (year%4==0?1:0);
		},
		//返回10位整型
		toInt: function(str){
			if( str === undefined || str === null ) return 0;
			return parseInt(str.replace(/,/g,''),10);
		},
		//判断日期是 (yyyy-MM-dd) 的格式
		isDate: function(str){
			if( this.typeis(str) === 'string' ){
				var arr=str.match(this.reg.isDate);
				if(arr){
					var y = this.toInt(arr[1]),m = this.toInt(arr[2])-1,d = this.toInt(arr[3]);
					var t = new Date( y,m,d );
					if ( 
						t.getFullYear() === y 
						&& t.getMonth() === m 
						&& t.getDate() === d 
					)
						return true;
				}
			}
			return false;
		},
		//判断日期时间是 (yyyy-MM-dd h:m:s.ms) 的格式
		isDateTime: function(str){
			if( this.typeis(str) === 'string' ){
				var arr=str.match(this.reg.isDateTime);
				if (arr){
					var y = this.toInt(arr[1]),m = this.toInt(arr[2])-1,d = this.toInt(arr[3]);
					var h = this.toInt(arr[4]||'')||0, min = this.toInt(arr[5]||'')||0, s = this.toInt(arr[6]||'')||0;
					var t = new Date( y,m,d,h,min,s );
					if (
						t.getFullYear() === y
						&& t.getMonth() === m
						&& t.getDate() === d
						&& t.getHours() === h
						&& t.getMinutes() === min
						&& t.getSeconds() === s
					)
						return true;
				}
			}
			return false;
		},
		//格式化日期输出指定格式的字符串(yyyy-MM-dd hh:mm:ss,SSS；yyyy-MM-dd hh:mm:ss；yyyy-MM-dd)
		toFormatString: function(date,fmt){
			if( arguments.length <2 ) return;
			var h={
				'y':date.getFullYear(),
				'M':date.getMonth()+1,
				'd':date.getDate(),
				'h':date.getHours(),
				'm':date.getMinutes(),
				's':date.getSeconds(),
				'S':date.getMilliseconds()
			};
			var repeat = function(times){
				var arr=[];
				arr[times]='';
				return arr.join('0');
			}
			var minL={'y':2};
			for (var name in h){
				if (h.hasOwnProperty(name)&&!(name in minL))
					minL[name]=h[name].toString().length;
			}
			return fmt.replace(this.reg.toFormatString,function(a,b){
				var t=h[b];
				var l=Math.max(a.length,minL[b]);
				return (repeat(l)+t).slice(-l);
			});
		},
		//计算时间(纠正时区问题)
		calcTime: function(offset){
			var d = new Date(); 
			return new Date( d.getTime() + (d.getTimezoneOffset() * 60000) + 3600000*offset );
		}, 
		//用${value}的形式匹配替换字符串
		replaceAll: function(str,d) {
	        return str.replace(/\$\{(\w+)\}/g, function (a, c) {
	            if (c in d) {
	                return d[c];
	            } else {
	                return a;
	            }
	        });
	    }

	});

	//把onine暴露给window
	w.online = online;
}(window));