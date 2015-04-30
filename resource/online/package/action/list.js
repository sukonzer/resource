/* 列表页 */
//增、改
var showTip = function(obj,msg){
	//聚焦
	obj.focus();
	//提示
	$('.popup span.tips').html('<span class="glyphicon glyphicon-flash"></span>'+msg);
	return false;
}
var check = function(){
	var Customer = $('#Customer'),
		Agency = $('#Agency'),
		CreativeDirector = $('#CreativeDirector'),
		ArtDirector = $('#ArtDirector'),
		WorkTime = $('#WorkTime'),
		FileInput = $('#FileInput');
		
	if(Customer.val().trim()<1){
		return showTip(Customer,'请填写客户');
	}
	if(Agency.val().trim()<1){
		return showTip(Agency,'请填写广告公司');
	}
	if(CreativeDirector.val().trim()<1){
		return showTip(CreativeDirector,'请填写创意总监');
	}
	if(ArtDirector.val().trim()<1){
		return showTip(ArtDirector,'请填写美术指导');
	}
	if(WorkTime.val().trim()<1){
		return showTip(WorkTime,'请填写时间');
	}
	if(FileInput.val().trim()<1){
		return showTip(FileInput,'请上传图片');
	}
	return true;
};
window.edit = function(data){
	$.dialog({
		drag:true,
		width:'500px',
		opacity:0,
		loadedCallback:function(){
			this.container.find('.bd').html($.tmpl.render($('#ListTmpl').html(),data));
			this.container.find('.ft>.btn-primary').before('<span class="tips"></span>');
		},
		okCallback:function(){
			this.isHide = false;
			if(check()){
				$('.form-horizontal').submit();
				this.closePop();
			}
		}
	});
}
//表格效果
$('.table').on('click','[aria-action=del]', function(){//删除按钮
	var $this = $(this),
		$tr = $this.closest('tr');
	$tr.hide(600,function(){
		$(this).remove();
	});
})
.on('click','[scope=controll]>input',function(){//全反选
	var $this = $(this),
		$tr = $('.table tbody tr');
	if(this.checked){
		$tr.each(function(){
			($(this).find('[scope=row]>input'))[0].checked = true;
			$(this).addClass('active');
		});
	}else{
		$tr.each(function(){
			($(this).find('[scope=row]>input'))[0].checked = false;
			$(this).removeClass('active');
		});
	}
})
.on('click','[scope=row]>input',function(){//行选
	var $this = $(this),
		$tr = $this.closest('tr');
	$tr[this.checked ? 'addClass' : 'removeClass']('active');
})