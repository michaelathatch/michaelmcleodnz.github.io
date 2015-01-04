//Globals:
var quadrantHeight = 1000; //Max height for path data and viewboxes
var blankGlyph = { path: "", w: 0, h: 0 }; //Represents a null glyph
var renderHeight = 48; //Default rendering height
var renderSpacing = 5; //Default rendering space

//From glyphs.js: var glyphs = JSON object with width, height and path data for glyphs
//From resources.js: var translit = JSON lookup table transliteration to Gardiner code
//From resources.js: var gardiner = JSON object listing basic Gardiner code by section
//From resources.js: var dictionary = JSON array of entries in the Dickson Dictionary

//Tests MdC or translit
function test(mdc) {
	return (glyphs[mdc] || translit[mdc]);
}

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
	return "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" \
			width=\"" + o.height + "\" height=\"" + o.height + "\" viewbox=\"0 0 " + quadrantHeight + " " + quadrantHeight + "\">\
			<path d=\"" + g.path + "\" fill=\"" + o.fill + "\" transform=\"translate(" + tw + " " + th + ")\"/>\
			</svg>";
}

//Renders a line of hieroglyphs
function renderLine(mdc, options) {
	var o = extend(options, {
		height: renderHeight,
		fill: "#000",
		centre: true,
		spacing: renderSpacing,
		reverse: false
	});
	var a = mdc.split(/[ *-]/);
	var totalWidth = 0;
	var result = "";
	for(i in a) {
		var g = glyphs[a[i]] ? glyphs[a[i]] : glyphs[translit[a[i]]] ? glyphs[translit[a[i]]] : blankGlyph;
		var tw = totalWidth;
		var th = o.centre ? (quadrantHeight - g.h)/2 : (quadrantHeight - g.h);
		result += "<path d=\"" + g.path + "\" fill=\"" + o.fill + "\" transform=\"translate(" + tw + " " + th + ")\"/>";
		totalWidth += parseFloat(g.w) + o.spacing * quadrantHeight/o.height;
	}
	return "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" \
			width=\"" + (totalWidth * o.height/quadrantHeight) + "\" height=\"" + o.height + "\" \
			viewbox=\"0 0 " + totalWidth + " " + quadrantHeight + "\">" +
			(o.reverse ? "<g transform=\"scale(-1,1)translate("+(-totalWidth)+")\">" : "") +
			result + (o.reverse ? "</g>" : "") + "</svg>";
}

//Display matching dictionary entries (too slow to be dynamic for short translit)
function displayMatches(mdc, options) {
	var o = extend(options, {
		fontSize: "1em",
		highlight: "#eee"
	});
	if(mdc == "") {
		return "";
	}
	var matches = findMatches(mdc);
	var result = "<p style=\"font-size:" + o.fontSize + "\">" + matches.length + " matches found:</p>";
	for(var i in matches) {
		var highlight = translate(matches[i].tlit).replace(translate(mdc), "<span style=background-color:" + o.highlight + ">" + translate(mdc) + "</span>");
		result += "<p style=\"font-size:" + o.fontSize + ";margin:0\">" + highlight + ": " + renderLine(matches[i].base, options) + " " + matches[i].def + "</p><br/>";
	}
	return result;
}

//Look in the dictionary for matches
function findMatches(mdc) {
	var matches = [];
	var count = 0;
	var mdc = mdc.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); //Escape for regex
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

//Renders the complete JSesh implementation of the Hieroglyphica
function renderAllSigns(options) {
	var o = extend(options, {
		height: renderHeight,
		centre: true
	});
	var result = "<hr/>FULL <a href='http://jsesh.qenherkhopeshef.org/'>JSESH</a> / <a href='http://hieroglyphes.pagesperso-orange.fr/Hieroglyphica%20=%20A.htm'>HIEROGLYPHICA</a> SIGN LIST: <hr/>";
	for(g in glyphs) {
		var tw = o.centre ? (quadrantHeight - glyphs[g].w)/2 : 0;
		var th = o.centre ? (quadrantHeight - glyphs[g].h)/2 : (quadrantHeight - g.h);
		result += "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" \
					width=\"" + o.height + "\" height=\"" + o.height + "\" viewbox=\"0 0 " + quadrantHeight + " " + quadrantHeight + "\">\
					<a xlink:href=\"#" + g + "\" xlink:title=\"" + g + "\">\
					<rect opacity=\"0\" width=\"" + quadrantHeight + "\" height=\"" + quadrantHeight + "\"/>\
					<path d=\"" + glyphs[g].path + "\" transform=\"translate(" + tw + " " + th + ")\"/>\
					</a></svg>";
	}
	return result;
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
			result += "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" \
						width=\"" + o.height + "\" height=\"" + o.height + "\" viewbox=\"0 0 " + quadrantHeight + " " + quadrantHeight + "\">\
						<a xlink:href=\"#" + gardiner[section][g] + "\" xlink:title=\"" + gardiner[section][g] + "\">\
						<rect opacity=\"0\" width=\"" + quadrantHeight + "\" height=\"" + quadrantHeight + "\"/>\
						<path d=\"" + glyphs[gardiner[section][g]].path + "\" transform=\"translate(" + tw + " " + th + ")\"/>\
						</a></svg>";
		}
		result += "<hr/>";
	}
	return result;
}

//Use the provided defaults unless they already exist in the options
function extend(options, defaults) {
	var options = options ? options : defaults;
	for(var prop in defaults) {
		options[prop] = typeof(options[prop]) !== 'undefined' ? options[prop] : defaults[prop];
	}
	return options;
}

//Convert MdC into rendered transliteration:
function translate(mdc) {
	var map = {
		'A': '\u021D',
		'i': '\u1F30',
		'j': '\u1F30',
		'a': '\u02C1',
		'H': '\u1E25',
		'x': '\u1E2B',
		'X': '\u1E96',
		'S': '\u0161',
		'q': '\u1E33',
		'K': '\u1E33',
		'T': '\u1E6F',
		'D': '\u1E0F',
		'.': '\u00B7',
		'=': '\u00B7',
		'^': {
			'A': '\u021D',
			'i': '\u1F38',
			'j': '\u1F38',
			'a': '\u02C1',
			'H': '\u1E24',
			'x': '\u1E2A',
			'X': "H\u0331",
			'S': '\u0160',
			'q': '\u1E32',
			'K': '\u1E32',
			'T': '\u1E6E',
			'D': '\u1E0E',
			'.': '\u00B7',
			'=': '\u00B7'
		}
	};
	var result = "";
	for(var i = 0; i < mdc.length; i++) {
		//If a * or ^ is found, treat the next character as a capital:
		if(mdc.charAt(i)=='*' || mdc.charAt(i)=='^') {
			i++;
			result += map['^'][mdc.charAt(i)] ? map['^'][mdc.charAt(i)] : mdc.charAt(i).toUpperCase();
		} else {
			result += map[mdc.charAt(i)] ? map[mdc.charAt(i)] : mdc.charAt(i);
		}
	}
	return result;
}