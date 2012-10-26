/*****************************************
    ********** Variables ****************
******************************************/
var pratikabu_stt_delay = 1200;// variable used to reduce the delay in scrolling
var pratikabu_stt_maxScrollAmount = 5;// the offset of the scroll bar
var pratikabu_stt_bVisibility = false;// variable to check whether the button is already visible or hidden
var pratikabu_stt_fadeSpeed = 300;
var pratikabu_stt_hoverOpacity = 1;
var pratikabu_stt_iconSize = 48;
var pratikabu_stt_fixed = "pratikabu-stt-";

var pratikabustt = {
    createButton: function() {
		// create div tag
		$('body').prepend('<div align="right" id="pratikabuSTTDiv"><img id="pratikabuSTTArrowUp" style="float: left;" /><img id="pratikabuSTTClear" /><img id="pratikabuSTTArrowDown" /></div>');
		
		pratikabustt.hoverEffect("#pratikabuSTTArrowUp", 0.5);
		pratikabustt.hoverEffect("#pratikabuSTTClear", 0.35);
		pratikabustt.hoverEffect("#pratikabuSTTArrowDown", 0.35);
		
		// prefsValue listner
    	self.port.on("prefsValue", function(data) {
			// load the css and image source from preference
			pratikabustt.loadFromPreference(data);
		});
		self.port.emit("getPrefs");// method to communicate to main.js
		
		// add the scroll up logic
		$("#pratikabuSTTArrowUp").click(function() {
			if($(this).attr("src").lastIndexOf("pause") == -1) {// identify up arrow
				pratikabustt.showPauseImage();
				$("html, body").stop(true, true).animate({ scrollTop: 0 }, pratikabu_stt_delay, function() {
					pratikabustt.showUpArrowImage();
				});
			} else {
				pratikabustt.showUpArrowImage();
				$("html, body").stop();
			}
			return false;
		});
		
		// add the scroll down logic
		$("#pratikabuSTTArrowDown").click(function() {
			pratikabustt.showPauseImage();
			$("html, body").stop(true, true).animate({ scrollTop: $(document).height() }, pratikabu_stt_delay, function() {
				pratikabustt.showUpArrowImage();
			});
			return false;
		});
		
		var scrollHandler = function () {
			pratikabustt.hideOrShowButton();
		};
		
		// add the remove div logic
		$("#pratikabuSTTClear").click(function() {
			$("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {
				$("#pratikabuSTTDiv").hide();
				pratikabu_stt_bVisibility = false;
				$(window).unbind('scroll', scrollHandler);
			});
		});
		
		// add the scroll handler on the page to hide and show the image
		$(window).scroll(scrollHandler);
	},
	
	hoverEffect: function(varId, idleOpacity) {
		$(varId).hide();
		$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, idleOpacity);
		$(varId).css("cursor", "pointer");
		$(varId).hover(
			function() {
				$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, pratikabu_stt_hoverOpacity);
			},
			function() {
				$(varId).stop(true, true).fadeTo(pratikabu_stt_fadeSpeed, idleOpacity);
			});
	},
	
	showPauseImage: function() {
		var imgUrl = pratikabu_stt_fixed + "pause-" + pratikabu_stt_iconSize + ".png";
		$("#pratikabuSTTArrowUp").attr("src", pratikabustt.getImgUrl(imgUrl));
	},
	
	showUpArrowImage: function() {
		$("#pratikabuSTTArrowUp").attr("src", pratikabustt.getImgUrl(pratikabu_stt_fixed + pratikabu_stt_iconSize + ".png"));
	},
    
    getImgUrl: function(imagePath) {
        return "resource://jid0-grmsxw9byuhwgjlhtxjg27ynzrs-at-jetpack/scroll-to-top/data/" + imagePath;
    },
	
	hideOrShowButton: function() {
		var scrollTop = $(document).scrollTop();
		
		// show the icon if it satisfies this condition
		pratikabu_stt_bVisibility = scrollTop > pratikabu_stt_maxScrollAmount ?
		pratikabu_stt_bVisibility || ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 1), true)
			: pratikabu_stt_bVisibility && ($("#pratikabuSTTDiv").stop(true, true).fadeTo("slow", 0, function() {if(!pratikabu_stt_bVisibility) $("#pratikabuSTTDiv").hide();}), false);
	},
	
	loadFromPreference: function(data) {
        // Asks background.html for [LocalStorage] settings from Options Page and assigns them to variables
		pratikabu_stt_iconSize = data.iconSize;
    	
		// set the vertical alignment of the image
        var location = "top";
        if(true == data.buttonAtBottom) {
            location = "bottom";
        }
        $("#pratikabuSTTDiv").css(location, "20px");
        
        // set the horizontal alignment of the image
        location = "right";
        if(true == data.buttonAtLeft) {
            location = "left";
        }
        $("#pratikabuSTTDiv").css(location, "20px");
		
		// set the image
		pratikabustt.showUpArrowImage();
		
		var downPixel = 16;
		if("48" == pratikabu_stt_iconSize) {
			downPixel = 24;
			$("#pratikabuSTTDiv").css("width", "72px");
		} else {
			$("#pratikabuSTTDiv").css("width", "48px");
		}
		
		imgUrl = pratikabu_stt_fixed + "clear-" + downPixel + ".png";
		$("#pratikabuSTTClear").attr("src", pratikabustt.getImgUrl(imgUrl));
		
		imgUrl = pratikabu_stt_fixed + "down-" + downPixel + ".png";
		$("#pratikabuSTTArrowDown").attr("src", pratikabustt.getImgUrl(imgUrl));
		
		// change the location of the main image
		var pratikabu_stt_float = "left";
		if("left" == location) {
			pratikabu_stt_float = "right";
		}
		
		$("#pratikabuSTTArrowUp").css("float", pratikabu_stt_float);
	}
}

pratikabustt.createButton();

$(document).ready(function() {// when page is ready do the below mentioned steps
	// hide or show the button based on the current location, because a page can be loaded scrolled..
	pratikabustt.hideOrShowButton();
});