//Globals:
var renderHeight = 48; //Default rendering height
var quadrantHeight = 1000; //Max height for path data and viewboxes
var blankGlyph = { path: "", w: 0, h: 0 }; //Represents a null glyph

//From glyphs.js: var glyphs = JSON object with width, height and path data for glyphs
//From resources.js: var translit = JSON lookup table transliteration to Gardiner code
//From resources.js: var gardiner = JSON object listing basic Gardiner code by section

//Renders a single hieroglyph
function renderSingle(mdc, options) {
	var o = extend(options, {
		height: renderHeight,
		fill: "#000",
		centre: true
	});
	var g = glyphs[mdc] ? glyphs[mdc] : glyphs[translit[mdc]] ? glyphs[translit[mdc]] : blankGlyph;
	var tw = o.centre ? (quadrantHeight - g.w)/2 : 0;
	var th = o.centre ? (quadrantHeight - g.h)/2 : 0;
	return "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" \
			width=\"" + o.height + "\" height=\"" + o.height + "\" viewbox=\"0 0 " + quadrantHeight + " " + quadrantHeight + "\">\
			<path d=\"" + g.path + "\" fill=\"" + o.fill + "\" transform=\"translate(" + tw + " " + th + ")\"/>\
			</svg>";
}

//Renders the complete JSesh implementation of the Hieroglyphica
function renderAllSigns(options) {
	var o = extend(options, {
		height: renderHeight,
		centre: true
	});
	var result = "FULL JSESH / HIEROGLYPHICA SIGN LIST: <hr/>";
	for(g in glyphs) {
		var tw = o.centre ? (quadrantHeight - glyphs[g].w)/2 : 0;
		var th = o.centre ? (quadrantHeight - glyphs[g].h)/2 : 0;
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
	var result = "SIGNS BY GARDINER CLASSIFICATION: <hr/>";
	for(section in gardiner) {
		result += section + "<hr/>";
		for(g in gardiner[section]) {
			var tw = o.centre ? (quadrantHeight - glyphs[gardiner[section][g]].w)/2 : 0;
			var th = o.centre ? (quadrantHeight - glyphs[gardiner[section][g]].h)/2 : 0;
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
		options[prop] = options[prop] ? options[prop] : defaults[prop];
	}
	return options;
}