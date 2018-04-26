let rotation = 0;
function up(){
	rotation+=45;
	$('.radial-nav').css({'transform' : 'rotate('+rotation+'deg)'});
	var c = $('.active-icon').attr('c');
	$('.active-icon').removeClass('active-icon');

	$( ".infoDisplay_"+c ).removeClass('swipeDown');
	$( ".infoDisplay_"+c ).removeClass('swipeUp');

	if(c==1){
		c=8;
	}
	else {
		c--;
	}

	$('.icon-'+c).addClass('active-icon');
	setTimeout(
	  function()
	  {
			$( ".infoDisplay_"+c ).delay( 1000 ).addClass('swipeDown');
	  }, 200);
}

function down(){
	rotation-=45;
	$('.radial-nav').css({'transform' : 'rotate('+rotation+'deg)'});
	var c = $('.active-icon').attr('c');
	$('.active-icon').removeClass('active-icon');

	$( ".infoDisplay_"+c ).removeClass('swipeDown');
	$( ".infoDisplay_"+c ).removeClass('swipeUp');

	if(c==8){
		c=1;
	}
	else {
		c++;
	}

	$('.icon-'+c).addClass('active-icon');

	setTimeout(
	  function()
	  {
			$( ".infoDisplay_"+c ).delay( 1000 ).addClass('swipeDown');
	  }, 200);
}

$(document).ready(function(){

	$('.up').click(function(){
		up();
	});
	$('.down').click(function(){
		down();
	});

	$('.start-bg').click(function(){
		toggleFullScreen();
		$(this).fadeOut(1500);
	});

});
