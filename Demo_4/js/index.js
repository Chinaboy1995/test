$(function () {
	var taglayoutInstance = new TagLayout('tag_container');

	$('#tag_analysis').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.module-container').css('display', 'none');
		taglayoutInstance.start();
	});

	$('#equipment_analysis').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.module-container').css('display', 'none');
        
	});

	$('#article_analysis').on('click', function () {
		$(this).addClass('active').siblings().removeClass('active');
		$('.module-container').css('display', 'none');

	});
});