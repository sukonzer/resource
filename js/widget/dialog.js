/*
*	Author: jvan
*	Email: 75863154@qq.com
*/
;(function($){
	var $doc = $(document),
		$bd = $(document.body),
		$win = $(window),
		__maskLayer__;//遮罩
	var dialog = function(option){
		var defaults = {
			drag: false,
			stop: true,
			title: '温馨提示',
			msg: '',
			width: '300px',
			opacity: .3,
			close: true,
			cancel: '取消',
			ok: '确认',
			isHide: true,
			zIndex: 999,
			tmpl: '<div class="popup">'+
				'{{if close}}<span class="close J_popclose" title="关闭">x</span>{{/if}}'+
				'{{if title}}<div class="hd">${title}</div>{{/if}}'+
				'<div class="bd">${msg}</div>'+
				'{{if ok || cancel}}<div class="ft">'+
					'{{if ok}}<a href="javascript:;" class="ok J_popok">${ok}</a>{{/if}}{{if cancel}}<a href="javascript:;" class="cancel J_popcancel">${cancel}</a>{{/if}}'+
				'</div>{{/if}}'+
			'</div>',
			loadedCallback: null,
			okCallback: null,
			cancelCallback: null,
			closeCallback: null
		}
		$.extend(this,defaults,option);
		
		var _this = this;
		this.mask.css('opacity',_this.opacity);
		this.mask.after('<div id="Pop__container__" style="width:'+_this.width+';z-index:'+_this.zIndex+'"></div>');
		this.container = $('#Pop__container__');
		this.container.html($.tmpl.render(this.tmpl,this));
		this.container.css({
			'position': 'absolute',
			'left': ($(window).width()-this.container.width())/2,
			'top': ($(window).height()-this.container.height())/2
		});
		
		this.closePop = function(){
			this.container.remove();
			this.mask.hide();
		}
		$.type(this.loadedCallback) === 'function' && this.loadedCallback.call(this,this.container);
		//是否开启拖拽
		if(this.drag){
			$.drag(this.container,'.hd');
		}
		
		//绑定事件
		$doc.on('click','.J_popok',function(e){
			if(_this.stop){
				ol.preventDefault(e);
				ol.stopPropagation(e);
			}
			$.type(_this.okCallback) === 'function' && _this.okCallback.call(_this,_this.container,e);
			if(_this.isHide){
				_this.closePop();
			}
		}).on('click','.J_popcancel',function(e){
			if(_this.stop){
				ol.preventDefault(e);
				ol.stopPropagation(e);
			}
			$.type(_this.cancelCallback) === 'function' && _this.cancelCallback.call(_this,_this.container,e);
			_this.closePop();
		}).on('click','.J_popclose',function(e){
			if(_this.stop){
				ol.stopPropagation(e);
			}
			$.type(_this.closeCallback) === 'function' && _this.closeCallback.call(_this,_this.container,e);
			_this.closePop();
		});
		/*//scroll时纠正其位置
		var initTop = ($(window).height()-this.container.height())/2,
			popTimer;//滚动纠正top定时器
		$win.on('scroll',function(){
			if(_this.container.is(':visible')){//显示时才纠正
				popTimer && clearTimeout(popTimer);
				popTimer = setTimeout(function(){
					_this.container.animate({'top':initTop+$win.scrollTop()},500);
				},200);
			}
		});*/
	}
	$.dialog = function(option){
		if(!__maskLayer__){
			__container__.append('<div id="Pop__maskLayer__"></div>');
			__maskLayer__ = $('#Pop__maskLayer__');
			__maskLayer__.css({'position':'absolute','top':0,'left':0,'background-color':'#000',"width":$win.width(),'height':$doc.height()});
		}else{
			__maskLayer__.show();
		}
		$.extend(option,{mask:__maskLayer__});
		return new dialog(option);
	};
}(jQuery));