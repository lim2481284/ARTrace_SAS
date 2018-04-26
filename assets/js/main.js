// Video Stream
var w = screen.width || window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = screen.height || window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

$(document).ready(function(){
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

	if (navigator.getUserMedia) {
		navigator.getUserMedia({video: true}, handleVideo, videoError);
	}

	function handleVideo(stream) {
		video.srcObject = stream;
		video2.width = w/2;
		video2.height = h;
		video2.srcObject = stream;
	}

	function videoError(e) {
		console.log("Error handling video");
		console.log(e)
	}

	$(".capture").click(function(){
		capture();
	})
})

function toggleFullScreen() {
	var doc = window.document;
	var docEl = doc.documentElement;

	var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
	var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

	if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
		requestFullScreen.call(docEl);
	}
	else {
		cancelFullScreen.call(doc);
	}
}

// Rotation
let rotation = 0;
function up(){
	rotation+=45;
	$('.radial-nav').css({'transform' : 'rotate('+rotation+'deg)'});
	var c = $('.active-icon').attr('c');
	$('.active-icon').removeClass('active-icon');

	$( ".infoDisplay" ).removeClass('swipeDown');
	$( ".infoDisplay" ).removeClass('swipeUp');

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

	$( ".infoDisplay").removeClass('swipeDown');
	$( ".infoDisplay" ).removeClass('swipeUp');

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

function capture(){
	if(!recording){
		recording = true;
		var canvas=document.createElement('canvas');
		canvas.width = video.width;
		canvas.height = video.height;
		canvas.getContext("2d").drawImage(video, 0, 0,canvas.width, canvas.height);
		var img = canvas.toDataURL("image/jpeg",1.0);
		//$(displayImage).attr("src",img)
		//console.log(img)
		recognizing = true;
		faceReco(img);
		//viewGallery();
	}else{
		recording = false;
		currentMeeting_id = null;
	}

}

let recording = false;
let recognizing = false;
let key = false;

$(document).ready(function(){

	$(window).on("keydown",function(e){
		key = e.keyCode;
		//console.log(e);
		if (key === 177 || e.key === "MediaTrackPrevious")
			up();
		if(key === 176 || e.key === "MediaTrackNext")
			down();
		if(key === 179 || e.key === "MediaPlayPause")
			capture();
	})

	$(window).on("keyup",function(e){
		key = false;
	})

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
