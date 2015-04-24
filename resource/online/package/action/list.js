/* 列表页 */
//增、改
window.edit = function(data){
	$.dialog({
		drag:true,
		width:'500px',
		opacity:0,
		loadedCallback:function(){
			this.container.find('.bd').html($.tmpl.render($('#ListTmpl').html(),data));
		}
	});
}
//表格效果
$('.table').on('click','[aria-action=del]', function(){//删除按钮
	var $this = $(this),
		$tr = $this.closest('tr');
	$tr.slideUp(500,function(){
		$(this).remove();
	});
})
.on('click','[scope=controll]>input',function(){//全反选
	var $this = $(this),
		subCk = $('[scope=row]>input');
	subCk.each(function(i,v){
			$(v).trigger('click');
		});
})
.on('click','[scope=row]>input',function(){//行选
	var $this = $(this),
		$tr = $this.closest('tr');
	$tr[$this[0].checked ? 'addClass' : 'removeClass']('active');
})