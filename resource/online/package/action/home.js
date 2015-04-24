/* 主页 */
window.listComplete = function(){
	$('#listLoading').remove();
	$('#listIframe').show();
}
var noTopHt = $(window).height()-$('.header').outerHeight();
//左边高度撑满
$('.row .col-xs-3').height(noTopHt);

//左边菜单栏
$('.panel-l').on('click','.list-group>a',function(){
	var $this = $(this),html;
	if($this.hasClass('disabled')) return;
	$this.addClass('active').siblings().removeClass('active');
	html = '<p id="listLoading">加载中...</p>'+
		'<iframe id="listIframe" src="'+$this.attr('data-url')+'" frameborder="0" name="list" onload="listComplete()" width="'+$('.main-r').width()+'" height="'+noTopHt+'" style="display:none;vertical-align:bottom;"></iframe>';
	$('.main-r').html(html);
});
$('.panel-l .list-group>a:eq(0)').trigger('click');