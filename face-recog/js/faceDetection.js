$(document).ready(function(){
	pModel.shapeModel.nonRegularizedVectors.push(9);
	pModel.shapeModel.nonRegularizedVectors.push(11);
	var ctracker = new clm.tracker({useWebGL : true});
	var videoInput = document.getElementById('video');
	var ec = new emotionClassifier();

	ec.init(emotionModel);
	ctracker.init(pModel);

	var loop=0;

	var trackingStarted = false;

	function startVideo() {
		// start video
		videoInput.play();
		// start tracking
		ctracker.start(videoInput);
		trackingStarted = true;
		// start loop to draw face
		setInterval(drawLoop, 100);

	}

	/*function positionLoop() {
		requestAnimationFrame(positionLoop);
		var positions = ctracker.getCurrentPosition();
		if (positions!==false){
			drawLoop();
		}
	}*/

	let canvasInput = document.getElementById('drawCanvas');
	let cc = drawCanvas.getContext('2d');


	function drawLoop() {

		//requestAnimationFrame(drawLoop);
		canvasInput.width = w;
		canvasInput.height = h;
		cc.clearRect(0, 0, 400, 300);
		cc.scale( (fullWidth?w/400:(w/2)/400),h/300);
		ctracker.draw(canvasInput);
		var cp = ctracker.getCurrentParameters();
		var allEmotion = ec.meanPredict(cp);
		if (cp && allEmotion){
			calculateEmotionScore(allEmotion)
		}

		/*
		0=angry
		1=disgusted
		2=fear
		3=sad
		4=surprise
		5=happy
		*/
	}


	function calculateEmotionScore(allEmotion){
		var emotionScore=0;
		var strongestEmotion=Math.max(allEmotion[0].value,allEmotion[1].value,allEmotion[2].value,allEmotion[3].value,allEmotion[4].value,allEmotion[5].value)
		if (strongestEmotion==allEmotion[0].value || strongestEmotion==allEmotion[1].value || strongestEmotion==allEmotion[2].value || strongestEmotion==allEmotion[3].value){
			emotionScore=(0.5*(1-allEmotion[0].value))
		}
		else if (strongestEmotion==allEmotion[4].value || strongestEmotion==allEmotion[5].value){
			emotionScore=0.5+(0.5*(1-allEmotion[0].value))
		}

		var score =  (emotionScore*100).toFixed(0);
		$(".info_score").html( score+" %" );
		
		if(score >70){
			$(".info_score").css('color','#7BFFC3');
			
		}else if(score>30){
			$(".info_score").css('color','#30CAFF');
		}
		else {
			$(".info_score").css('color','#FF3030');
		}

		if( Math.abs(currentScore - emotionScore) > 0.1 ){
			currentScore = emotionScore;
			// add to db if in session
			if(recording && currentMeeting_id){
				addEmotion(currentMeeting_id, emotionScore).done(function(res){
					console.log(res);
				});
			}

		}
		//console.log(emotionScore)
	}

	startVideo()
})

let currentScore = 0;
let currentMeeting_id = null;
let currentMeeting = null;
