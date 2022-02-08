
//
//			Created by Baxter Kemp
//			in 2022
// 
//			Feel free to use any of the below code.
//			No need to ask for permission!
//


var pickerXPer = 100;
var pickerYPer = 0;
var pickerYPerInverse = 100;

// Called when page is loaded
$(document).ready(function() {

	
	$("#color-picker").css("transform", "translateX(" + ($("#color-container").width() - 20) + "px)");
	$("#color-picker").css("background-color", "red");
	// ------------ H E X ------------- //
  	$("#hex-box").on("input", function(event) {

	  	// Don't allow special characters
	  	$("#hex-box").val(function(i, v) {
		    return v.replace(/[^A-Fa-f0-9]/gi, '');
		  });

	  	// Adds hash when no hash is found
	  	var val = $("#hex-box").val();
	  	if (val.charAt(0) != "#") {
	  		val = "#" + val;
	  		$("#hex-box").val(val);
	  	}

	  	// Only allow 6 characters (and 1 character for hash)
	  	if (val.length >= 7) {
	  		$("#hex-box").val(val.slice(0,7));
	  	}                  

	  	// Whole hex value
	  	if (val.length == 7) {
		    
		    let RGBArray = hexToRgb($("#hex-box").val());

		    // Update Everything | HAS TO BE IN THIS ORDER!!
		    convertToColorPicker(RGBArray.r, RGBArray.g, RGBArray.b);
		    updateHighlights($("#hex-box").val());
		    updateValues($("#hex-box").val(), "HEX");
	  	}


  	});

  	// Select Text when HEX filled out
  	$("#hex-box").on("click", function() {
  		if ($("#hex-box").val().length == 7) {
  			$("#hex-box").select();
	  	}
  	});

  	// Hex Box nothing typed, remove hash and revert to HTML placeholder text
  	$("#hex-box").on("blur", function() {
  		if ($("#hex-box").val() == "#") {
  			$("#hex-box").val("");
  		}
  	});



  	// ------------ R G B ------------- //
  	$(".selection-rgb-box").on("input click", function() {

	  	// Don't allow special characters or letters
	  	$(".selection-rgb-box").val(function(i, v) {
		    return v.replace(/[^0-9]/gi, '');
		  });

	  	// RGB Box Max digits
	  	var rbgArray = ["#red-box", "#green-box", "#blue-box"];
	  	for (i = 0; i < 3; i++) {
			if ($(rbgArray[i]).val().length > 3) {
				$(rbgArray[i]).val($(rbgArray[i]).val().slice(0,3));
			}
			if ($(rbgArray[i]).val() >= 255) {
					$(rbgArray[i]).val(255);
			}
		}

		// Check every value is filled out
		if ($("#red-box").val() && $("#green-box").val() && $("#blue-box").val()) {
			var rgbArray = [$("#red-box").val(), $("#green-box").val(), $("#blue-box").val()];
			var rgb = ("rgb(" + rgbArray[0] + ", " + rgbArray[1] + ", " + rgbArray[2] + ")");

			convertToColorPicker(rgbArray[0], rgbArray[1], rgbArray[2]);
			
			// Update colors and fonts
			updateHighlights(rgb);
			updateValues(rgbArray, "RGB");
		    
		}
	});



  	// ------------ R A I N B O W  S L I D E R  ------------- //
  	$("#rainbow-slider").on("input", function() {
  		var colorArray = hsv2rgb($("#rainbow-slider").val(), (pickerXPer / 100), (pickerYPerInverse / 100));
  		var colorRGB = "rgb(" + colorArray[0] + ", " + colorArray[1] + ", " + colorArray[2] + ")";

  		// Get picker pos and convert to hsl
  		updateHighlights(colorRGB);
  		updateValues(colorArray, "RGB");

  	});

	$("#color-container").on({
		mousedown: function() {
			$("*").css("user-drag", "none");
			$("*").css("user-select", "none");
			$("*").css("standard-user-select", "none");
			$("*").css("-webkit-touch-callout", "none");
			$("*").css("-webkit-tap-highlight-color", "none");
			$("*").css("-webkit-tap-highlight-color", "none");
			$("*").data('cursor', "pointer");

			$("#color-container").data('clicked', true);

			updateColorSlider();
		},
		// Mobile Support
		touchstart: function() {
			$("#color-container").data('clicked', true);

			updateColorSlider();			
		}
    });

    $(document).on({
        mouseup: function() {
            $("#color-container").data('clicked', false);

			$("*").css("user-drag", "");
			$("*").css("user-select", "");
			$("*").css("standard-user-select", "");
			$("*").css("-webkit-touch-callout", "");
			$("*").css("-webkit-tap-highlight-color", "");
			$("*").data('cursor', "default");
        },

        mousemove: function() {
            if ($("#color-container").data('clicked')) {
            	
            	updateColorSlider();
            }
        },

        // Mobile Support
        touchmove: function() {
            if ($("#color-container").data('clicked')) {
            	
            	updateColorSlider();
            }
        },

        touchend: function() {
			$("#color-container").data('clicked', false);
        },

        touchcancel: function() {
        	$("#color-container").data('clicked', false);
        }
    });

});

// Convert HEX/RGB to colour picker
function convertToColorPicker(red, green, blue) { // Takes RGB colours

	// Update Slider
	$("#rainbow-slider").val(rgbToHsl(red, green, blue)[0] * 360);

	// Position of colour on grid (Percentage)
	var colorPercentageX = rgb2hsv(red, green, blue).s;
	var colorPercentageY = 100 - rgb2hsv(red, green, blue).v; // Has to be inverted

	// Calculate Picker Position | Reverse % back into offset number
	xPos = ((colorPercentageX / 100) * ($("#color-container").width() - 20));
	yPos = ((colorPercentageY / 100) * ($("#color-container").height() - 20));

	// Update Picker Position
	$("#color-picker").css("transform", "translate(" + xPos + "px, " + yPos + "px)");
}

// Color slider/picker functionality
function updateColorSlider() {
	// Get offset amount
	var xPos = event.pageX - $("#color-container").offset().left;
	var yPos = event.pageY - $("#color-container").offset().top;
	var pickerSize = 20;
	var pickerOffset = 10;

	// Keep picker within bounds
	if (yPos < 0 + 10) {
		yPos = 0 + 10;
	} else if (yPos > ($("#color-container").height() - pickerSize) + 10) {
		yPos = ($("#color-container").height() - pickerSize + 10);
	}
	if (xPos < 0 + 10) {
		xPos = 0 + 10;
	} else if (xPos > ($("#color-container").width() - pickerSize) + 10) {
		xPos = ($("#color-container").width() - pickerSize + 10);
	}
	xPos -= 10;
	yPos -= 10;

	
	// Move Picker through CSS transformation into correct position
	$("#color-picker").css("transform", "translate(" + xPos + "px, " + yPos + "px)");

	// Turn offset into percentage
	pickerXPer = Math.ceil(xPos / ($("#color-container").width() - pickerSize) * 100);
	pickerYPer = Math.ceil(yPos / ($("#color-container").height() - pickerSize) * 100);
	pickerYPerInverse = (100 - pickerYPer);

	// Convert HSV to RGB
	var rgb = hsv2rgb($("#rainbow-slider").val(), (pickerXPer / 100), (pickerYPerInverse / 100));
	//console.log(pickerXPer);
	// Update
	updateHighlights("rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")");
	updateValues(rgb, "RGB");

}

// Update Color Highlights
function updateHighlights(colour) {
	$("#text-color").css("background-color", colour);
	$("#text-color").css("border-color", colour);
	$(".selection-box").css("border-color", colour);
	$(".selection-rgb-box").css("border-color", colour);
	$("#black-or-white").css("font-size", 40);
	$("#black-or-white").css("font-weight", "bold");
	$("#color-picker").css("background-color", colour);
}

// Update Color Values
function updateValues(colour, type) {
	
	// Convert every value to RGB
	var red, green, blue;
	if (type == "HEX") {
		red = hexToRgb(colour).r;
  		green = hexToRgb(colour).g;
    	blue = hexToRgb(colour).b;
	} else if (type == "RGB") {
		red = colour[0];
		green = colour[1];
		blue = colour[2];
	}



  	// Calculate Luminosity from RGB values
    var luminosity = (((0.299 * red) + (0.587 * green) + (0.114 * blue)) / 255);


    if (luminosity > 0.5) { // Black Text
    	$("#black-or-white").text("black");
    	$("#black-or-white").css("color", "black");
    	$(".final-subtitle").css("color", "black");
    } else { // White Text
    	$("#black-or-white").text("white");
    	$("#black-or-white").css("color", "white");
    	$(".final-subtitle").css("color", "white");
    }

    // Fill in RGB values
    $("#red-box").val(red);
    $("#green-box").val(green);
    $("#blue-box").val(blue);

    // Fill in HEX values
    $("#hex-box").val("#" + rgbToHex($("#red-box").val()) + rgbToHex($("#green-box").val()) + rgbToHex($("#blue-box").val()));

	// Update Color Picker Background
    var rgbArray = hslTorgb($("#rainbow-slider").val(), 1, 0.5);
    var rgb = "rgb(" + rgbArray[0] + ", " + rgbArray[1] + ", " + rgbArray[2] + ")";
	$("#color-hue").css("background", rgb);

    //console.log(rgb2hsv(red, green, blue)[1] * 100);

    //console.log();
    
}




















// Convert Hex code to RGB

// This basically just splits the HEX value into three values and converts to a number within 1-255 range.
// First two digits of the HEX code are red, second two are green and last two are blue.
// Cause the HEX value can only use 0-9 and A-F, this uses a RegEx (Regular Expression) to get the right values only.

// All rights go to Tim Down | From https://stackoverflow.com/a/5624139/16982236
function hexToRgb(hex) { 
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// RGB to a HEX Component
function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

// RGB to HSL
function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

// HSL to RGB | Not going to create my own solution when someone else has already created a optimized method and has already written it up
// From https://stackoverflow.com/a/54014428/16982236 and the Wiki: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative

function hslTorgb(h,s,l) 
{
  let a= s*Math.min(l,1-l);
  let f= (n,k=(n+h/30)%12) => l - a*Math.max(Math.min(k-3,9-k,1),-1);
  return [Math.ceil(f(0)*255),Math.ceil(f(8)*255),Math.ceil(f(4)*255)];
}    


// created By Kamil Kiełczewski | From https://stackoverflow.com/a/54070620/16982236
function hsv2rgb(h,s,v) 
{                              
  let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);     
  return [Math.ceil(f(5) * 255), Math.ceil(f(3) * 255), Math.ceil(f(1) * 255)];       
}  

// From https://stackoverflow.com/a/8023734/16982236
function rgb2hsv (r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = r / 255;
    gabs = g / 255;
    babs = b / 255;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: percentRoundFn(s * 100),
        v: percentRoundFn(v * 100)
    };
}



// Get Color from slider | From https://stackoverflow.com/a/6736135/16982236
function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
    		console.log(obj.offsetParent);
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}



