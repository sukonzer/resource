/*
*	Author: jvan
*	Email: 75863154@qq.com
*/
;(function($){
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
			tmpl: '<div class="popup"{{if width || zIndex}} style="width:${width};z-index:${zIndex}">{{/if}}'+
				'{{if close}}<span class="close J_popclose" title="关闭">x</span>{{/if}}'+
				'{{if title}}<div class="hd">${title}</div>{{/if}}'+
				'<div class="bd">${msg}</div>'+
				'<div class="ft">'+
					'{{if ok}}<a href="javascript:;" class="ok J_popok">${ok}</a>{{/if}}{{if cancel}}<a href="javascript:;" class="cancel J_popcancel">${cancel}</a>{{/if}}'+
				'</div>'+
			'</div>',
			loadedCallback: null,
			okCallback: null,
			cancelCallback: null,
			closeCallback: null
		}
		$.extend(this,defaults,option);
		
		var _this = this;
		if(!this.mask){
			this.mask = $('<div>');
			__container__.append(this.mask);
			this.mask.css({'position':'absolute','top':0,'left':0,'background-color':'#000','opacity':_this.opacity,"width":$(window).width(),'height':$(document).height()});
		}else{
			this.mask.show();
		}
		
		this.mask.after($.tmpl.render(this.tmpl,this));
		this.container = $('.popup');
		if(this.container.css('position') != 'absolute' && this.container.css('position') != 'fixed'){
			this.container.css({
				'position': (ol.browser.msie && ol.browser.version === '6.0') ? 'absolute' : 'fixed',
				'left': ($(window).width()-this.container.width())/2,
				'top': ($(window).height()-this.container.height())/2
			});
		}
		
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
		$(document).on('click','.J_popok',function(e){
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
	}
	$.dialog = function(option){
		return new dialog(option);
	}
}(jQuery));