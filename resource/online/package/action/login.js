/* 登录页 */
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
var showTip = function(obj,msg){
	//聚焦
	obj.focus();
	//提示
	$('#J_tip').html('<span class="glyphicon glyphicon-flash"></span>'+msg);
	return false;
}
var check = function(){
	var User = $('#User'),
		Password = $('#Password'),
		Vericode = $('#Vericode');
	if(User.val().trim()<1){
		return showTip(User,'请填写账户');
	}
	if(Password.val().trim()<1){
		return showTip(Password,'请填写密码');
	}
	if(Vericode.val().trim()<1){
		return showTip(Vericode,'请填写验证码');
	}
	return true;
};
//表单提交验证
$('.post_form').on('click','[type=button]',function(){
	if(check()){
		$('.post_form').submit();
	}
});