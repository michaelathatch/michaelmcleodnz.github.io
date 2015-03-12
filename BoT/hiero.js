// ----- GLOBAL VARIABLES ----- //

var quadrantHeight = 1000; //Max height for path data and viewboxes
var blankGlyph = { path: "", w: 0, h: 0 }; //Represents a null glyph
var renderHeight = 48; //Default rendering height
var renderSpacing = 5; //Default rendering space

//From glyphs.js: var glyphs = JSON object with width, height and path data for glyphs
//From resources.js: var translit = JSON lookup table transliteration to Gardiner code
//From resources.js: var gardiner = JSON object listing basic Gardiner code by section
//From resources.js: var dictionary = JSON array of entries in the Dickson Dictionary

//Alphabet maps from resources.js: toTranslit, fromTranslitCaps, fromTranslitNoCaps

// ----- HELPER METHODS ----- //

//Test if mdc represnts valid glyph or transliteration
function isGlyph(mdc) {
	return (glyphs[mdc] || translit[mdc]);
}

//Add default values to an options object
function extend(options, defaults) {
	var options = options ? options : defaults;
	for(var prop in defaults) {
		options[prop] = typeof(options[prop]) !== 'undefined' ? options[prop] : defaults[prop];
	}
	return options;
}

//Convert MdC into rendered transliteration
function transliterate(mdc) {
	return convert(mdc, toTranslit);
}

//Convert rendered transliteration into MdC
function untransliterate(mdc, ignoreCaps) {
	return convert(mdc, (ignoreCaps ? fromTranslitNoCaps : fromTranslitCaps));
}

//Replace all keys in the string with their corresponding values
function convert(str, map) {
	var result = "";
	for(var i = 0; i < str.length; i++) {
		result += map[str.slice(i, i + 2)] || map[str.charAt(i)] || str.charAt(i);
		if(map[str.slice(i, i + 2)]) {
			i++;
		}
	}
	return result;
}

// ----- RENDERING METHODS ----- //

//Renders a single hieroglyph
function renderSingle(mdc, options) {
	var o = extend(options, {
		height: renderHeight,
		fill: "#000",
		centre: true
	});
	var g = glyphs[mdc] ? glyphs[mdc] : glyphs[translit[mdc]] ? glyphs[translit[mdc]] : blankGlyph;
	var tw = o.centre ? (quadrantHeight - g.w)/2 : 0;
	var th = o.centre ? (quadrantHeight - g.h)/2 : (quadrantHeight - g.h);
	return "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' \
			width='" + o.height + "' height='" + o.height + "' viewbox='0 0 " + quadrantHeight + " " + quadrantHeight + "'>\
			<path d='" + g.path + "' fill='" + o.fill + "' transform='translate(" + tw + " " + th + ")'/>\
			</svg>";
}

//Renders a line of hieroglyphs
function renderLine(mdc, options) {
	var o = extend(options, {
		height: renderHeight,
		spacing: renderSpacing,
		fill: "#000",
		centre: true,
		reverse: false
	});
	var a = mdc.split(/[ *-]/);
	var totalWidth = 0;
	var result = "";
	for(i in a) {
		var g = glyphs[a[i]] ? glyphs[a[i]] : glyphs[translit[a[i]]] ? glyphs[translit[a[i]]] : blankGlyph;
		var tw = totalWidth;
		var th = o.centre ? (quadrantHeight - g.h)/2 : (quadrantHeight - g.h);
		result += "<path d='" + g.path + "' fill='" + o.fill + "' transform='translate(" + tw + " " + th + ")'/>";
		totalWidth += parseFloat(g.w) + o.spacing * quadrantHeight/o.height;
	}
	return "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' \
			width='" + (totalWidth * o.height/quadrantHeight) + "' height='" + o.height + "' \
			viewbox='0 0 " + totalWidth + " " + quadrantHeight + "'>" +
			(o.reverse ? "<g transform='scale(-1,1)translate("+(-totalWidth)+")'>" : "") +
			result + (o.reverse ? "</g>" : "") + "</svg>";
}

//Renders the signs in the basic Gardiner sign list by section
function renderSignList(options) {
	var o = extend(options, {
		height: renderHeight,
		centre: true
	});
	var result = "<hr/>SIGNS BY GARDINER CLASSIFICATION: <hr/>";
	for(section in gardiner) {
		result += section + "<hr/>";
		for(g in gardiner[section]) {
			var tw = o.centre ? (quadrantHeight - glyphs[gardiner[section][g]].w)/2 : 0;
			var th = o.centre ? (quadrantHeight - glyphs[gardiner[section][g]].h)/2 : (quadrantHeight - g.h);
			result += "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' \
						width='" + o.height + "' height='" + o.height + "' viewbox='0 0 " + quadrantHeight + " " + quadrantHeight + "'>\
						<a xlink:href='#" + gardiner[section][g] + "' xlink:title='" + gardiner[section][g] + "'>\
						<rect opacity='0' width='" + quadrantHeight + "' height='" + quadrantHeight + "'/>\
						<path d='" + glyphs[gardiner[section][g]].path + "' transform='translate(" + tw + " " + th + ")'/>\
						</a></svg>";
		}
		result += "<hr/>";
	}
	return result;
}

//Renders the complete JSesh implementation of the Hieroglyphica
function renderAllSigns(options) {
	var o = extend(options, {
		height: renderHeight,
		centre: true
	});
	var result = "<hr/>FULL <a href='http://jsesh.qenherkhopeshef.org/' target='_blank'>JSESH</a> \
				/ <a href='http://hieroglyphes.pagesperso-orange.fr/Hieroglyphica%20=%20A.htm' target='_blank'>HIEROGLYPHICA</a> \
				SIGN LIST: <hr/>";
	for(g in glyphs) {
		var tw = o.centre ? (quadrantHeight - glyphs[g].w)/2 : 0;
		var th = o.centre ? (quadrantHeight - glyphs[g].h)/2 : (quadrantHeight - g.h);
		result += "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' \
					width='" + o.height + "' height='" + o.height + "' viewbox='0 0 " + quadrantHeight + " " + quadrantHeight + "'>\
					<a xlink:href='#" + g + "' xlink:title='" + g + "'>\
					<rect opacity='0' width='" + quadrantHeight + "' height='" + quadrantHeight + "'/>\
					<path d='" + glyphs[g].path + "' transform='translate(" + tw + " " + th + ")'/>\
					</a></svg>";
	}
	return result;
}

//Renders matching dictionary entries (too slow to be dynamic for short translit)
function findAndRenderMatches(mdc, options) {
	var o = extend(options, {
		fontSize: "1em",
		highlight: "#eee"
	});
	if(mdc == "") {
		return "";
	}
	var matches = findMatches(mdc);
	var result = "<p style='font-size:" + o.fontSize + "'>" + matches.length + " matches found for " + transliterate(mdc) + " (" + mdc + "):</p>";
	for(var i in matches) {
		var highlight = transliterate(matches[i].tlit).replace(transliterate(mdc), "<span style=background-color:" + o.highlight + ">" + transliterate(mdc) + "</span>");
		result += "<p style='font-size:" + o.fontSize + ";margin:0'>" + highlight + ": " + renderLine(matches[i].base, options) + " " + matches[i].def + "</p><br/>";
	}
	return result;
}

//Look in the dictionary for matches
function findMatches(mdc) {
	var matches = [];
	var count = 0;
	var mdc = mdc.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); //Escape regex characters
	//Complete match:
	for(var entry in dictionary) {
		if(dictionary[entry].tlit == mdc) {
			matches[count] = dictionary[entry];
			count++;
		}
	}
	//Word at start:
	for(var entry in dictionary) {
		if((new RegExp("^"+mdc+"\\s.")).test(dictionary[entry].tlit) && !(dictionary[entry].tlit == mdc)) {
			matches[count] = dictionary[entry];
			count++;
		}
	}
	//Word elsewhere:
	for(var entry in dictionary) {
		if((new RegExp("\\s" + mdc + "(\\s|$)")).test(dictionary[entry].tlit) && !(dictionary[entry].tlit == mdc)) {
			matches[count] = dictionary[entry];
			count++;
		}
	}
	//Contains at all:
	for(var entry in dictionary) {
		if(dictionary[entry].tlit.indexOf(mdc) > -1 && !(new RegExp("\\s" + mdc + "(\\s|$)")).test(dictionary[entry].tlit) && !(new RegExp("^" + mdc + "\\s.")).test(dictionary[entry].tlit) && !(dictionary[entry].tlit == mdc)) {
			matches[count] = dictionary[entry];
			count++;
		}
	}
	return matches;
}

//Dynamically transliterate the contents of a text field element (remember to untransliterate contents before usage)
function renderAsTransliteration(el) {
	el.addEventListener ? el.addEventListener("keypress", pressHandler) : el.attachEvent("onkeypress", pressHandler);
	el.addEventListener ? el.addEventListener("keydown", downHandler) : el.attachEvent("onkeydown", downHandler);
	el.addEventListener ? el.addEventListener("paste", pasteHandler) : el.attachEvent("onpaste", pasteHandler);
	function pressHandler(event) {
		var key = String.fromCharCode(event.keyCode || event.charCode);
		if(/[\w.=]/.test(key)) {
			event.preventDefault ? event.preventDefault() : event.returnValue = false; //OldIE
			var start = this.selectionStart;
			var end = this.value.length - this.selectionEnd;
			if(this.value.charAt(start - 1) == '^') {
				this.value = this.value.slice(0, start - 1) + transliterate('^' + key) + this.value.slice(el.value.length - end);
			} else {
				this.value = this.value.slice(0, start) + transliterate(key) + this.value.slice(el.value.length - end);
			}
			this.selectionStart = this.selectionEnd = el.value.length - end;
		}
		return false;
	}
	function downHandler(e) {
		//Backspace:
		if((event.keyCode || event.charCode) == 8) {
			var start = this.selectionStart;
			var end = this.selectionEnd;
			if(start == end && (this.value.charAt(start - 1) == '\u0331' || this.value.charAt(start - 1) == '\u032D')) {
				event.preventDefault ? event.preventDefault() : event.returnValue = false; //OldIE
				this.value = this.value.slice(0, start - 2) + this.value.slice(end);
				this.selectionStart = this.selectionEnd = start - 2;
			}
		//Below all works fine on Chrome, but not OldIE
		//Delete:
		} else if((event.keyCode || event.charCode) == 46) {
			var start = this.selectionStart;
			var end = this.selectionEnd;
			if(start == end && (this.value.charAt(end + 1) == '\u0331' || this.value.charAt(end + 1) == '\u032D')) {
				event.preventDefault ? event.preventDefault() : event.returnValue = false; //OldIE
				this.value = this.value.slice(0, start) + this.value.slice(end + 2);
				this.selectionStart = this.selectionEnd = start;
			}
		//Left:
		} else if((event.keyCode || event.charCode) == 37) {
			var start = this.selectionStart;
			var end = this.selectionEnd;
			if(start == end && (this.value.charAt(start - 1) == '\u0331' || this.value.charAt(start - 1) == '\u032D')) {
				event.preventDefault ? event.preventDefault() : event.returnValue = false; //OldIE
				this.selectionStart = this.selectionEnd = start - 2;
			}
		//Right:
		} else if((event.keyCode || event.charCode) == 39) {
			var start = this.selectionStart;
			var end = this.selectionEnd;
			if(start == end && (this.value.charAt(end + 1) == '\u0331' || this.value.charAt(end + 1) == '\u032D')) {
				event.preventDefault ? event.preventDefault() : event.returnValue = false; //OldIE
				this.selectionStart = this.selectionEnd = start + 2;
			}
		}
	}
	function pasteHandler() {
		var end = this.value.length - this.selectionEnd;
		setTimeout(function() {
			el.value = transliterate(el.value);
			el.selectionStart = el.value.length - end;
			el.selectionEnd = el.value.length - end;
		}, 1);
	}
}