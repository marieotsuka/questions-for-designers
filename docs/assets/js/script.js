console.log('script');

$(function(){
	
	//apply gradient calculated by gradient.js
	$('body').css('background', formula);

	//toggle display of questions / designers
	//on title page
	$('.title').click(function(){
		let key = $(this).attr('id').split('-')[0];
		$('main').attr('data-toggle', key);
	});

	$('#home').click(function(e){
		console.log(e);
 		if($(e.target).hasClass('title')){
 			console.log('clicked on title');
 		}else{
 			$('main').attr('data-toggle', 'hidden');
 		}
	});
});