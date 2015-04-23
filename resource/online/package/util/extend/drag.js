/*
*	Author: jvan
*	Email: 75863154@qq.com
*/
;(function(w,$){
var $doc = $(document),
	$bd = $(document.body),
	$win = $(window);
	/**
	 * @method drag
	 * 拖拽功能
	 * @param {object} drag容器
	 * @param {string} mousemove绑定对象名
	 * @param {function} mousedown回调
	 */
	$.drag = function(container,targetName,callback){
		var selectName;
		container = $(container);
		containerName = container[0].id ? '#'+container[0].id : '.'+container[0].className
		if(container.length <=0){
			return;
		}
		if($.type(targetName) != 'string'){
			selectName = containerName;
		}else{
			selectName = containerName+' '+targetName;
		}
		$(selectName).css('cursor','move');
		$doc.on('mousedown',selectName,function(e){
			var ot = container.offset(),
				disX = e.pageX - ot.left,
				disY = e.pageY - ot.top,
				userSelect = online.getStyleName('user-select');
			
			if(container.css('position') != 'absolute'){
				container.css('position','absolute');
			}
			if(container.setCapture){
				container.setCapture();
			}else if(w.captureEvents){
				w.captureEvents('mousemove' || 'mouseup');
			}
			if($.type(callback) === 'function'){
				callback(container);
			}
			$doc.on({
				'mouseup': function(){
					if(container.releaseCapture){
						container.releaseCapture();
					}else if(w.releaseEvents){
						w.releaseEvents('mousemove' || 'mouseup');
					}
					//打开文本选中
					if($.type(userSelect) === 'string'){
						document.documentElement.style[userSelect] = '';
					}else{
						document.unselectable = "off";
						document.onselectstart = null;
					}
					$doc.off('mousemove').off('mouseup');
				},
				'mousemove': function(e){
					var l = e.pageX - disX,
						t = e.pageY - disY;
					//禁用文本选中
					if($.type(userSelect) === 'string'){
						document.documentElement.style[userSelect] = 'none';
					}else{
						document.unselectable = "on";
						document.onselectstart = function(){return false;};
					}
					
					if(l>$win.width()-container.width()){
						l = $win.width()-container.width();
					}else if(l<=0){
						l = 0;
					}
					
					if(t>$doc.height() - container.height()){
						t = $doc.height()-container.height();
					}else if(t<=0){
						t = 0;
					}
					container.css({
						'left': l,
						'top': t
					});
				}
			});
		});
	}
}(window,jQuery));