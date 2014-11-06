/* 登录页 */
!(function(){
	$(function(){
		var wh = $(window).height(),
			logWp = $('#J_logWp').height(),
			ranBox = $('#J_ranBox');
		ranBox.css({height:(wh-logWp)/2+360});
		var bgc = ['B3B3B3','81B2B1','F37565','634F5F'],
			i = 0,speed = 5000;
		(function cgColor(){
			setTimeout(function(){
				i++;
				ranBox.css({'background-color': '#'+bgc[i]});
				if(i==bgc.length-1){
					i = -1;
				}
				cgColor();
			},speed)
		})();
		$(window).resize(function(){
			var wh = $(window).height();
			ranBox.css({height:(wh-logWp)/2+360});
		});
		
		$(".post_form").Validform({
			tiptype:function(msg,o,cssctl){
				//msg：提示信息;
				//o:{obj:*,type:*,curform:*}, obj指向的是当前验证的表单元素（或表单对象），type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态, curform为当前form对象;
				//cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
				if(!o.obj.is("form")){//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
					var objtip=$("#J_tip");
					cssctl(objtip,o.type);
					objtip.text(msg);
				}
			}
		});
	
	})
}());