



$(document).on('ready', function() {

      var slide = $('.slider-single');
      var slideTotal = slide.length - 1;
      var slideCurrent = -1;

      function slideInitial() {
        slide.addClass('proactivede');
        setTimeout(function() {
          slideRight();
        }, 500);
      }

      function slideRight() {
        if (slideCurrent < slideTotal) {
          slideCurrent++;
        } else {
          slideCurrent = 0;
        }

        if (slideCurrent > 0) {
          var preactiveSlide = slide.eq(slideCurrent - 1);
        } else {
          var preactiveSlide = slide.eq(slideTotal);
        }
        var activeSlide = slide.eq(slideCurrent);
        if (slideCurrent < slideTotal) {
          var proactiveSlide = slide.eq(slideCurrent + 1);
        } else {
          var proactiveSlide = slide.eq(0);

        }

        slide.each(function() {
          var thisSlide = $(this);
          if (thisSlide.hasClass('preactivede')) {
            thisSlide.removeClass('preactivede preactive active proactive').addClass('proactivede');
          }
          if (thisSlide.hasClass('preactive')) {
            thisSlide.removeClass('preactive active proactive proactivede').addClass('preactivede');
          }
        });
        preactiveSlide.removeClass('preactivede active proactive proactivede').addClass('preactive');
        activeSlide.removeClass('preactivede preactive proactive proactivede').addClass('active');
        proactiveSlide.removeClass('preactivede preactive active proactivede').addClass('proactive');
      }

      function slideLeft() {
        if (slideCurrent > 0) {
          slideCurrent--;
        } else {
          slideCurrent = slideTotal;
        }

        if (slideCurrent < slideTotal) {
          var proactiveSlide = slide.eq(slideCurrent + 1);
        } else {
          var proactiveSlide = slide.eq(0);
        }
        var activeSlide = slide.eq(slideCurrent);
        if (slideCurrent > 0) {
          var preactiveSlide = slide.eq(slideCurrent - 1);
        } else {
          var preactiveSlide = slide.eq(slideTotal);
        }
        slide.each(function() {
          var thisSlide = $(this);
          if (thisSlide.hasClass('proactivede')) {
            thisSlide.removeClass('preactive active proactive proactivede').addClass('preactivede');
          }
          if (thisSlide.hasClass('proactive')) {
            thisSlide.removeClass('preactivede preactive active proactive').addClass('proactivede');
          }
        });
        preactiveSlide.removeClass('preactivede active proactive proactivede').addClass('preactive');
        activeSlide.removeClass('preactivede preactive proactive proactivede').addClass('active');
        proactiveSlide.removeClass('preactivede preactive active proactivede').addClass('proactive');
      }

      function skipSlide(slideNum) {
        slideCurrent = slideNum;
        if (slideCurrent > 0) {
          slideCurrent--;
        } else {
          slideCurrent = slideTotal;
        }

        if (slideCurrent < slideTotal) {
          var proactiveSlide = slide.eq(slideCurrent + 1);
        } else {
          var proactiveSlide = slide.eq(0);
        }
        var activeSlide = slide.eq(slideCurrent);
        if (slideCurrent > 0) {
          var preactiveSlide = slide.eq(slideCurrent - 1);
        } else {
          var preactiveSlide = slide.eq(slideTotal);
        }
        slide.each(function() {
          var thisSlide = $(this);
          if (thisSlide.hasClass('proactivede')) {
            thisSlide.removeClass('preactive active proactive proactivede').addClass('preactivede');
          }
          if (thisSlide.hasClass('proactive')) {
            thisSlide.removeClass('preactivede preactive active proactive').addClass('proactivede');
          }
          if (thisSlide.hasClass('active')) {
            thisSlide.removeClass('preactivede preactive active proactive');
          }
        });
        preactiveSlide.removeClass('preactivede active proactive proactivede').addClass('preactive');
        activeSlide.removeClass('preactivede preactive proactive proactivede').addClass('active');
        proactiveSlide.removeClass('preactivede preactive active proactivede').addClass('proactive');
      }

	  function menu_img_fly(){
		  
		  		$('#menu-right').fadeOut('fast');
		$('#menu-left').fadeOut('fast');
		setTimeout(function(){
			$('#menu-right').fadeIn('fast');
		$('#menu-left').fadeIn('fast');
		}, 500);
	  }
	  
      var left = $('.slider-left');
      var right = $('.slider-right');
      left.on('click', function() {
        slideLeft();
		menu_img_fly();
      });
      right.on('click', function() {
        slideRight();
		menu_img_fly();
      });
      slideInitial();


  });
