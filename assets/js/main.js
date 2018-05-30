// Video Stream
var w = screen.width || window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var h = screen.height || window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

function startDictation() {
	console.log("Dictation Started");
	if (window.hasOwnProperty('webkitSpeechRecognition')) {

		var recognition = new webkitSpeechRecognition();

		recognition.continuous = true	;
		recognition.interimResults = false;

		recognition.lang = "en-US";
		recognition.start();
		recognition.onsoundend =function(){
			recognition.stop();
		}


		recognition.onresult = function(e) {
			//document.getElementById('transcript').value = e.results[0][0].transcript;
			console.log(e.results[0][0].transcript);

			recognition.stop();
			startDictation();
			for(var i=0; i<2; i++){
				if(e.results[0][0].transcript.indexOf($('.list_'+i).val()) >= 0){
					$('.list_'+i).prop('checked', true);
				}
			}

		};

		recognition.onerror = function(e) {
			recognition.stop();
		}

	}
}

startDictation();

$(document).ready(function(){
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

	if (navigator.getUserMedia) {
		navigator.getUserMedia({video: true}, handleVideo, videoError);
	}

	function handleVideo(stream) {
		video.srcObject = stream;
		if(!fullWidth){
			video2.width = w/2;
			video2.height = h;
			video2.srcObject = stream;
		}
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
		startDictation();
		//viewGallery();
	}else{
		editMeeting(Math.round(new Date()/1000)-currentMeeting.timestamp);
		recording = false;
		currentMeeting_id = null;
		currentMeeting = null;
		//stopDictation();
	}

}

let recording = false;
let recognizing = false;
let key = false;

//If face detected 
function face_detected(){
	$('.dank-ass-loader').addClass('detect-loader-flyout');
	 $('.detecting-label').html('DETECTED !');
	 setTimeout(function(){
	  $('.icon').show();
		$('.icon').addClass('icon--order-success');
	}, 600);
	setTimeout(function(){
		$('.detecting-section').addClass('detect-flyout');
		$('#drawCanvas').fadeOut('fast');			
	}, 2000);
	 setTimeout(function(){
		info_fly_in();
	}, 3000);
}

function formatAMPM(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'PM' : 'AM';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ' ' + ampm;
	  return strTime;
}
	
	
//If face is detecting 
function face_detecting(){
	setTimeout(function(){
		  $('.detecting-section').addClass('detect-flyin');
		  $('.dank-ass-loader').addClass('detect-loader-flyin');
		}, 1500);
		setTimeout(function(){
		  $('#drawCanvas').fadeIn('fast');		  
		}, 4500);		
}


//profile info fly in 
function info_fly_in(){
	$('.wrapper').addClass('profile-detail-flyin');
	$('.wrapper-bottom').addClass('profile-mood-flyin');
	$('.wrapper-left').addClass('profile-image-flyin');
}

function goodjob_fly_in(){
	$('.checklist-inner-left').addClass('goodjob-flyin');
	setTimeout(function(){
		$('.togo').show();
	}, 800);
	setTimeout(function(){
		$('.checklist-inner-left').addClass('goodjob-flyout');
	}, 3000);
	setTimeout(function(){
		$('.checklist-inner-left').attr('class','checklist-inner-left');
		$('.togo').hide();
	}, 3500);
}

$(document).ready(function(){
	
	$('.current-time').html(formatAMPM( new Date()));

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
		$(this).fadeOut(1000);
		face_detecting();
		countup();
	});

	
	//animation here 
	$('.switch-detected').click(function(){		
		face_detected()
	});
	$('.switch-menu-in').click(function(){		
		$('.slider-container').addClass('menu-fly-in');		
	});
	$('.switch-menu-out').click(function(){		
		$('.slider-container').addClass('menu-fly-out');
		setTimeout(function(){
			$('.slider-container').attr('class','slider-container');
		}, 500);
	});	
	
	
	$(document).on('change','.checklist-mark',function(){
			
			var count =0;
			var total =0;
			$('.checklist-mark').each(function(i, obj) {
				if($(this).prop('checked')){
					count++;					
				}
				total++;
			});			
			var current = total - count ;
			var current_percentage = count/total *100;
			
			$('.skill-progress-bar').css('width',current_percentage+'%');
			$('.skill-progress-value').html(current_percentage+'%');
			if(current_percentage ==100){
				$('.checklist-inner-bottom').addClass('progress-completed');
				$('.completed-label').addClass('label-completed');
			}
			if(current ==0) {
				$('.togo').html('ALL DONE!');
			}else 
			{
				$('.togo').html( current + ' TO GO');
			}
			goodjob_fly_in();
	});
	
});



//Countup
function countup(){
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;
setInterval(setTime, 1000);

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}
}


