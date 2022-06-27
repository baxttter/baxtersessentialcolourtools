//
//		Created by Baxter Kemp
//		in 2022
//
//		Feel free to use any of the below code.
//		No need to ask for permission!
//

let pickerXPer = 100;
let pickerYPer = 0;
let pickerYPerInverse = 100;

let colors = $.ajax({type: "GET", url: "colors.csv", async: false}).responseText;
const colorsArray = $.csv.toObjects(colors);

// Called when page is loaded
$(document).ready(() => {

	// Move Cursor to right at start
	$("#color-picker").css("transform", `translateX(${$("#color-container").width() - 20}px)`);
	$("#color-picker").css("background-color", "red");

	// ------------ H E X ------------- //
	$("#hex-box").on("input", () => {
		// Don't allow special characters
		$("#hex-box").val((i, v) => v.replace(/[^a-f0-9]/gi, ''));

		// Adds hash when no hash is found
		let val = $("#hex-box").val();
		if (val.charAt(0) !== "#") {
			val = `#${val}`;
			$("#hex-box").val(val);
		}

		// Only allow 6 characters (and 1 character for hash)
		if (val.length >= 7) {
			$("#hex-box").val(val.slice(0, 7));
		}

		// Whole hex value
		if (val.length === 7) {
			const RGBArray = hexToRGB($("#hex-box").val());

			// Update Everything | HAS TO BE IN THIS ORDER!!
			convertToColorPicker(RGBArray.r, RGBArray.g, RGBArray.b);
			updateHighlights($("#hex-box").val());
			updateValues($("#hex-box").val(), "HEX");
		}
	});

	// Hex Box nothing typed, remove hash and revert to HTML placeholder text
	$("#hex-box").on("blur", () => {
		if ($("#hex-box").val() === "#") {
			$("#hex-box").val("");
		}
	});

	// ------------ R G B ------------- //
	$(".selection-rgb-box").on("input click", () => {
		// Don't allow special characters or letters
		$(".selection-rgb-box").val((i, v) => v.replace(/[^0-9]/g, ''));

		// RGB Box Max digits
		const rbgArray = ["#red-box", "#green-box", "#blue-box"];
		for (let i = 0; i < 3; i += 1) {
			if ($(rbgArray[i]).val().length > 3) {
				$(rbgArray[i]).val($(rbgArray[i]).val().slice(0, 3));
			}
			if ($(rbgArray[i]).val() >= 255) {
				$(rbgArray[i]).val(255);
			}
		}

		// Check every value is filled out
		if ($("#red-box").val() && $("#green-box").val() && $("#blue-box").val()) {
			const rgbArray = [$("#red-box").val(), $("#green-box").val(), $("#blue-box").val()];
			const rgb = (`rgb(${rgbArray})`);

			convertToColorPicker(...rgbArray);

			// Update colors and fonts
			updateHighlights(rgb);
			updateValues(rgbArray, "RGB");
		}
	});

	// ------------ B I N A R Y ------------- //
	$(".binary-selection-box").on("input click", () => {

		// Don't allow special characters
		$(".binary-selection-box").val((i, v) => v.replace(/[^01]/gi, ''));
		
		// Loop through bytes
		for (let i = 1; i < 7; i++) {

			// Get input number
			let binaryVal = $(`#binary-${i}`).val();

			// Convert input from base 2 (Binary) to base 10 (Int)
			let byteInt = parseInt(binaryVal, 2);
		
			// Change binary-HEX preview 
			$(`#binary-${i}-conv`).text(byteInt.toString(16).toUpperCase());

			// Make sure NaN is replaced with '0'
			if ($(`#binary-${i}-conv`).text() == "NAN") {
				$(`#binary-${i}-conv`).text("0");
			}
		}

		// Whole byte completed
		if ($("#binary-1").val() && $("#binary-2").val() && $("#binary-3").val() && $("#binary-4").val() && $("#binary-5").val() && $("#binary-6").val()) {
			
			// Create HEX
			let hex = "";

			// Loop through bytes
			for (let i = 1; i < 7; i++) {
				hex += $(`#binary-${i}-conv`).text();
			}

			// Add hash
			hex = "#" + hex;

			const RGBArray = hexToRGB(hex);

			// Update Everything | HAS TO BE IN THIS ORDER!!
			convertToColorPicker(RGBArray.r, RGBArray.g, RGBArray.b);
			updateHighlights(hex);
			updateValues(hex, "pleaseDontUpdateBinary");
			//updateValues(hex, "HEX");
		}
	});

	// Add extra zeros
	$(".binary-selection-box").focusout( () => {
		for (let i = 0; i < 6; i++) {
			$(`#binary-${(i + 1)}`).val($(`#binary-${(i + 1)}`).val().padStart(4, '0'));
		}
	});

	// ------------ R A I N B O W  S L I D E R  ------------- //
	$("#rainbow-slider").on("input", () => {
		const colorArray = hsvToRGB($("#rainbow-slider").val(), (pickerXPer / 100), (pickerYPerInverse / 100));
		const colorRGB = `rgb(${colorArray})`;

		// Get picker pos and convert to hsl
		updateHighlights(colorRGB);
		updateValues(colorArray, "RGB");
	});

	$("#color-container").on({
		mousedown: () => {
			["user-drag", "user-select", "webkit-touch-callout", "webkit-tap-highlight-color"].forEach(
				property => $("*").css(property, "none")
			);
			$("*").data('cursor', "pointer");

			$("#color-container").data('clicked', true);
			updateColorSlider();
		},
	});

	$(document).on({
		mouseup: () => {
			["user-drag", "user-select", "webkit-touch-callout", "webkit-tap-highlight-color"].forEach(
				property => $("*").css(property, "")
			);
			$("*").data('cursor', "default");

			$("#color-container").data('clicked', false);
		},

		mousemove: () => {
			if ($("#color-container").data('clicked')) {
				updateColorSlider();
			}
		},
	});

	$(".color-palette-color").on("click", function() {
		let position = $(this).attr('id').charAt($(this).attr('id').length - 1);
		copyToClipboard("#" + $(this).attr('id') + " > div > p");
	});

});

// Color Palette Generator
function generateColorPalette(...rgb) {
	const HSL = rgbToHSL(...rgb); // Returns array

	// Get Full Range of Lightness
	const fullArray = [];
	for (let i = Math.round(HSL[2] * 100); i < 100; i += 10) {
		fullArray.push(i);
	}
	for (let i = Math.round(HSL[2] * 100) - 10; i > 0; i -= 10) {
		fullArray.unshift(i);
	}

	// Display Color Palette
	const colorPalette = [0, 10, 30, 50, 70, 90];
	for (let i = 1; i < 6; i += 1) {
		if (Math.ceil(HSL[1] * 100) > 80) {
			$(`#color-box-${i}`).css("background", `hsl(${$("#rainbow-slider").val()}, ${Math.ceil(HSL[1] * 100) - 15}%, ${colorPalette[i]}%)`);
		} else {
			$(`#color-box-${i}`).css("background", `hsl(${$("#rainbow-slider").val()}, ${Math.ceil(HSL[1] * 100)}%, ${colorPalette[i]}%)`);
		}

		let rgbString = $(`#color-box-${i}`).css("background-color")
		rgbString = rgbString.replace(/[^\d,]/g, '').split(',');

		let luminosity2 = (((0.299 * rgbString[0]) + (0.587 * rgbString[1]) + (0.114 * rgbString[2])) / 255);

		if (luminosity2 > 0.5) { // Black Text
			$(`#color-box-${i}`).css("color", "black");
		} else { // White Text
			$(`#color-box-${i}`).css("color", "white");
		}
		$(`#color-box-${i} > div > p`).text("#" + rgbToHEX(rgbString[0]) + rgbToHEX(rgbString[1]) + rgbToHEX(rgbString[2]) );
	}
}

// Convert HEX/RGB to colour picker
function convertToColorPicker(...rgb) { // Takes RGB colours
	// Update Slider
	$("#rainbow-slider").val(rgbToHSL(...rgb)[0] * 360);

	// Position of colour on grid (Percentage)
	const colorPercentageX = rgbToHSV(...rgb).s;
	const colorPercentageY = 100 - rgbToHSV(...rgb).v; // Has to be inverted

	// Calculate Picker Position | Reverse % back into offset number
	let xPos = ((colorPercentageX / 100) * ($("#color-container").width() - 20));
	let yPos = ((colorPercentageY / 100) * ($("#color-container").height() - 20));

	// Update Picker Position
	$("#color-picker").css("transform", `translate(${xPos}px, ${yPos}px)`);
}

// Color slider/picker functionality
function updateColorSlider() {
	// Get offset amount
	let xPos = event.pageX - $("#color-container").offset().left;
	let yPos = event.pageY - $("#color-container").offset().top;
	const pickerSize = 20;

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
	$("#color-picker").css("transform", `translate(${xPos}px, ${yPos}px)`);

	// Turn offset into percentage
	pickerXPer = Math.ceil(xPos / ($("#color-container").width() - pickerSize) * 100);
	pickerYPer = Math.ceil(yPos / ($("#color-container").height() - pickerSize) * 100);
	pickerYPerInverse = (100 - pickerYPer);

	// Convert HSV to RGB
	const rgb = hsvToRGB($("#rainbow-slider").val(), (pickerXPer / 100), (pickerYPerInverse / 100));

	// Update
	updateHighlights(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
	updateValues(rgb, "RGB");
}

// Update Color Highlights
function updateHighlights(colour) {
	
	// Color picker
	["#text-color", "#color-picker"].forEach(el => $(el).css("background-color", colour));

	// Element outlines
	["#text-color", ".selection-box", ".selection-rgb-box, #dropper-box", ".binary-selection-box"].forEach(el => $(el).css("border-color", colour));

	// Text stuff
	$("#black-or-white").css("font-size", 40);
	$("#black-or-white").css("font-weight", "bold");
	$("#dropper-box").css("color", "white");

}

// Update Color Values
function updateValues(colour, type) {
	// Convert every value to RGB
	let red, green, blue;

	if (type === "HEX") {
		red = hexToRGB(colour).r;
		green = hexToRGB(colour).g;
		blue = hexToRGB(colour).b;
	} else if (type === "RGB") {
		[red, green, blue] = colour;
	} else if (type === "pleaseDontUpdateBinary") {
		red = hexToRGB(colour).r;
		green = hexToRGB(colour).g;
		blue = hexToRGB(colour).b;		
	}

	$(".color-palette-color").css("transition", "unset");
	generateColorPalette(red, green, blue);
	$(".color-palette-color").css("transition", "0.2s");

	// Calculate Luminosity from RGB values
	const luminosity = (((0.299 * red) + (0.587 * green) + (0.114 * blue)) / 255);

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
	let hex = `#${rgbToHEX($("#red-box").val())}${rgbToHEX($("#green-box").val())}${rgbToHEX($("#blue-box").val())}`;
	$("#hex-box").val(hex);

	// Fill in Binary values
	if (type !== "pleaseDontUpdateBinary") {
		let hexWithoutHash = hex.substring(1);
		for (let i = 0; i < 6; i++) {

			// Convert Base 16 (HEX) to Base 10 (Int)
			intValue = parseInt(hexWithoutHash.charAt(i), 16);

			// Convert Base 10 (Int) to Base 2 (Binary)
			if ($("*:focus").attr("id") != (`binary-${i}`)) {
				$(`#binary-${(i + 1)}`).val((intValue.toString(2)).padStart(4, '0'));
			}

			// Update Binary to HEX preview
			$(`#binary-${(i + 1)}-conv`).text(hexWithoutHash.charAt(i).toUpperCase());

		}
	}

	// Update Color Picker Background
	const rgbArray = hslToRGB($("#rainbow-slider").val(), 1, 0.5);
	const rgb = `rgb(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`;
	$("#color-hue").css("background", rgb);


}

// Open Colour Dropper
function openDropper() {
	let resultElement = $("dropper-box").attr("value");

	if (!window.EyeDropper) {
		resultElement = 'Your browser does not support the EyeDropper API';
		return;
	}

	const eyeDropper = new EyeDropper();
	const abortController = new AbortController();

	eyeDropper.open().then(result => {
		resultElement = result.sRGBHex;
		const rgb = hexToRGB(result.sRGBHex);
		convertToColorPicker(rgb.r, rgb.g, rgb.b);
		updateHighlights(result.sRGBHex);
		updateValues(result.sRGBHex, "HEX");
	}).catch(e => {
		resultElement = e;
	});
}

$("#dropper-box").click(() => openDropper());

// Convert Hex code to RGB

// This basically just splits the HEX value into three values and converts to a number within 1-255 range.
// First two digits of the HEX code are red, second two are green and last two are blue.
// Cause the HEX value can only use 0-9 and A-F, this uses a RegEx (Regular Expression) to get the right values only.

// All rights go to Tim Down | From https://stackoverflow.com/a/5624139/16982236
function hexToRGB(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	} : null;
}

// RGB to a HEX Component
function rgbToHEX(rgb) {
	let hex = Number(rgb).toString(16);
	if (hex.length < 2) {
		hex = `0${hex}`;
	}
	return hex;
}

// RGB to HSL
function rgbToHSL(...rgb) {
	rgb = rgb.map(x => x / 255);

	const max = Math.max(...rgb), min = Math.min(...rgb);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case rgb[0]: {
				h = (rgb[1] - rgb[2]) / d + (rgb[1] < rgb[2] ? 6 : 0);
				break;
			}
			case rgb[1]: {
				h = (rgb[2] - rgb[0]) / d + 2;
				break;
			}
			case rgb[2]: {
				h = (rgb[0] - rgb[1]) / d + 4;
				break;
			}
		}
		h /= 6;
	}

	return [h, s, l];
}

// HSL to RGB | Not going to create my own solution when someone else has already created a optimized method and has already written it up
// From https://stackoverflow.com/a/54014428/16982236 and the Wiki: https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB_alternative

function hslToRGB(...hsl) {
	const a = hsl[1] * Math.min(hsl[2], 1 - hsl[2]);
	const f = (n, k = (n + hsl[0] / 30) % 12) => hsl[2] - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	return [Math.ceil(f(0) * 255), Math.ceil(f(8) * 255), Math.ceil(f(4) * 255)];
}

// created By Kamil Kiełczewski | From https://stackoverflow.com/a/54070620/16982236
function hsvToRGB(...hsv) {
	const f = (n, k = (n + hsv[0] / 60) % 6) => hsv[2] - hsv[2] * hsv[1] * Math.max(Math.min(k, 4 - k, 1), 0);
	return [Math.ceil(f(5) * 255), Math.ceil(f(3) * 255), Math.ceil(f(1) * 255)];
}

// From https://stackoverflow.com/a/8023734/16982236
function rgbToHSV(...rgb) {
	let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, percentRoundFn;
	[rabs, gabs, babs] = rgb.map(x => x / 255);
	v = Math.max(rabs, gabs, babs);
	diff = v - Math.min(rabs, gabs, babs);
	let diffc = c => (v - c) / 6 / diff + 1 / 2;
	percentRoundFn = num => Math.round(num * 100) / 100;
	if (diff === 0) {
		h = s = 0;
	} else {
		s = diff / v;
		[rr, gg, bb] = [rabs, gabs, babs].map(x => diffc(x));

		if (rabs === v) {
			h = bb - gg;
		} else if (gabs === v) {
			h = (1 / 3) + rr - bb;
		} else if (babs === v) {
			h = (2 / 3) + gg - rr;
		}
		if (h < 0) {
			h += 1;
		} else if (h > 1) {
			h -= 1;
		}
	}
	return {
		h: Math.round(h * 360),
		s: percentRoundFn(s * 100),
		v: percentRoundFn(v * 100),
	};
}

function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
