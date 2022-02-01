
//
//			Created by Baxter Kemp
//			in 2022
// 
//			Feel free to use any of the below code.
//			No need to ask for permission!
//




// Called when page is loaded
$(document).ready(function(){

	// ------------ H E X ------------- //
  $("#hex-box").on("input click", function(){

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

  		// Get RBG values from hex
	  	var red = hexToRgb($("#hex-box").val()).r;
	  	var green = hexToRgb($("#hex-box").val()).g;
	    var blue = hexToRgb($("#hex-box").val()).b;

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

	    // Update colors and fonts
	    $("#text-color").css("background-color", $("#hex-box").val());
	    $("#text-color").css("outline-color", $("#hex-box").val());
	    $(".selection-box").css("outline-color", $("#hex-box").val());
	    $(".selection-rgb-box").css("outline-color", $("#hex-box").val());
	    $("#black-or-white").css("font-size", 40);
	    $("#black-or-white").css("font-weight", "bold");

  	}
                           

  });

  // Hex Box nothing typed, remove hash and revert to HTML placeholder text
  $("#hex-box").on("blur", function(){
  	if ($("#hex-box").val() == "#") {
  		$("#hex-box").val("");
  	}
  });














  // ------------ R G B ------------- //
  $(".selection-rgb-box").on("input click", function(){

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
			var rgb = ("rgb(" + $("#red-box").val() + ", " + $("#green-box").val() + ", " + $("#blue-box").val() + ")");

			var luminosity = (((0.299 * $("#red-box").val()) + (0.587 * $("#green-box").val()) + (0.114 * $("#blue-box").val())) / 255);


	    if (luminosity > 0.5) { // Black Text
	    	$("#black-or-white").text("black");
	    	$("#black-or-white").css("color", "black");
	    	$(".final-subtitle").css("color", "black");
	    } else { // White Text
	    	$("#black-or-white").text("white");
	    	$("#black-or-white").css("color", "white");
	    	$(".final-subtitle").css("color", "white");
	    }

	    // Update colors and fonts
	    $("#hex-box").val("#" + rgbToHex($("#red-box").val()) + rgbToHex($("#green-box").val()) + rgbToHex($("#blue-box").val()));
	    $("#text-color").css("background-color", rgb);
	    $("#text-color").css("outline-color", rgb);
	    $(".selection-box").css("outline-color", rgb);
	    $(".selection-rgb-box").css("outline-color", rgb);
	    $("#black-or-white").css("font-size", 40);
	    $("#black-or-white").css("font-weight", "bold");
	    $("#pallet-box-brightness").css("background", ("linear-gradient(90deg, rgba(0,0,0,1) 0%, " + rgb + " 50%, rgba(225,225,225,1) 100%)"));

	  }
	  
	  // ------------ R G B ------------- //
	  $("#pallet-box").on("change", function(){
	  	alert("jey");
	  });

	});


  var canvas = document.getElementById('pallet-box-rainbow');
	var ctx = canvas.getContext('2d');

	// Create a linear gradient
	// The start gradient point is at x=20, y=0
	// The end gradient point is at x=220, y=0
	var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);

	// Add three color stops
	gradient.addColorStop(0.0, "rgba(255,0,0,1)");
	gradient.addColorStop(0.1, "rgba(255,154,0,1)");
	gradient.addColorStop(0.2, "rgba(208,222,33,1)");
	gradient.addColorStop(0.3, "rgba(79,220,74,1)");
	gradient.addColorStop(0.4, "rgba(63,218,216,1)");
	gradient.addColorStop(0.5, "rgba(47,201,226,1)");
	gradient.addColorStop(0.6, "rgba(28,127,238,1)");
	gradient.addColorStop(0.7, "rgba(95,21,242,1)");
	gradient.addColorStop(0.8, "rgba(186,12,248,1)");
	gradient.addColorStop(0.9, "rgba(251,7,217,1)");
	gradient.addColorStop(1.0, "rgba(255,0,0,1)");

	// Set the fill style and draw a rectangle
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, canvas.width, 150);

	$("#pallet-box-rainbow").mousemove(function(e){
    var pos = findPos(this);
    var x = (e.pageX - pos.x) / 2;
    var y = (e.pageY - pos.y) / 2;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    //var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    var rgb = "rgb(" + p[0] + ", " + p[1] + ", " + p[2] + ")";
    $("#red-box").val(p[0]);e
	  $("#green-box").val(p[1]);
	  $("#blue-box").val(p[2]);
	  $(".selection-rgb-box").trigger("click");
	  console.log(x);
	});

});






// Convert Hex code to RGB

// This basically just splits the HEX value into three values and converts to a number within 1-225 range.
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

// RGB to HEX Component
function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
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





