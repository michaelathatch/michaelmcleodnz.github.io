//From glyphs.js: var glyphs = JSON object with width, height and path data for glyphs
//From resources.js: var translit = JSON lookup table transliteration to Gardiner code
//From hiero1.js: var quadrantHeight = 1000;
//From hiero1.js: var blankGlyph = {path:"", w:0, h:0};
//From hiero1.js: var renderHeight = 48;
//From hiero1.js: var renderSpacing = 5;
//From hiero1.js: function extend = Add default values to an options object

function render(mdc, options) {
	var o = extend(options, {
		height: renderHeight,	//All glyphs scaled to match at top level only - Not propagated
		spacing: renderSpacing,	//Space between signs
		fill: "#000",			//Colour all glyphs - Not propagated (yet)
		centre: true,			//Centre small signs
		reverse: false,			//Flip all glyphs - Not propagated
		vertical: false			//Reading direction - Unimplemented
	});
	o.spacing *= quadrantHeight / o.height;
	//var quadrant = new concatenation(mdc, o);
	var quadrant = new baseQuadrant(mdc, o);
	var result = quadrant.render(0, 0);
	var totalWidth = quadrant.width;
	return "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' version='1.1' \
			width='" + (totalWidth * o.height / quadrantHeight) + "' height='" + o.height + "' \
			viewbox='0 0 " + totalWidth + " " + quadrantHeight + "' fill='" + o.fill + "'>" +
			(o.reverse ? "<g transform='scale(-1,1)translate("+(-totalWidth)+")'>" : "") +
			result + (o.reverse ? "</g>" : "") + "</svg>";
}

var baseQuadrant = function(mdc, o) {
	return (concatenation(subordination(juxtaposition(glyph))))(mdc, o);
}

function concatenation(nextQuadrant) {
	return function(mdc, o) {
		var els = mdc.split("-");
		var totalWidth = 0;
		var maxHeight = 0;
		for(var i in els) {
			var q = new nextQuadrant(els[i], o);
			totalWidth += q.width + o.spacing;
			if(maxHeight < q.height) {
				maxHeight = q.height;
			}
		}
		totalWidth -= o.spacing;
		return {
			render: function(x, y) {
				var result = "";
				for(var i in els) {
					var q = new nextQuadrant(els[i], o);
					var ty = o.centre ? y + (maxHeight - q.height)/2: y;
					result += q.render(x, ty);
					x += q.width + o.spacing;
				}
				return result;
			},
			width: totalWidth,
			height: maxHeight
		}
	}
};

function subordination(nextQuadrant) {
	return function(mdc, o) {
		var els = mdc.split(":");
		var totalHeight = 0;
		var maxWidth = 0;
		for(var i in els) {
			var q = new nextQuadrant(els[i], o);
			totalHeight += q.height + o.spacing;
			if(maxWidth < q.width) {
				maxWidth = q.width;
			}
		}
		totalHeight -= o.spacing;
		var scaled = totalHeight > quadrantHeight;
		var scale = quadrantHeight / totalHeight;
		return {
			render: function(x, y) {
				var result = scaled ? "<g transform='scale(" + scale + ")'>" : "";
				for(var i in els) {
					var q = new nextQuadrant(els[i], o);
					var tx = scaled ? x / scale : x;
					tx = o.centre ? tx + (maxWidth - q.width)/2 : tx;
					result += q.render(tx, y);
					y += q.height + o.spacing;
				}
				return result + (scaled ? "</g>" : "");
			},
			width: scaled ? maxWidth * scale : maxWidth,
			height: scaled ? quadrantHeight : totalHeight
		}
	}
};

function juxtaposition(nextQuadrant) {
	return function(mdc, o) {
		var els = mdc.split("*");
		var totalWidth = 0;
		var maxHeight = 0;
		for(var i in els) {
			var q = new nextQuadrant(els[i], o);
			totalWidth += q.width + o.spacing;
			if(maxHeight < q.height) {
				maxHeight = q.height;
			}
		}
		totalWidth -= o.spacing;
		return {
			render: function(x, y) {
				var result = "";
				for(var i in els) {
					var q = new nextQuadrant(els[i], o);
					var ty = o.centre ? y + (maxHeight - q.height)/2: y;
					result += q.render(x, ty);
					x += q.width + o.spacing;
				}
				return result;
			},
			width: totalWidth,
			height: maxHeight
		}
	}
};

var glyph = function(mdc, o) {
	var g = glyphs[mdc] ? glyphs[mdc] : glyphs[translit[mdc]] ? glyphs[translit[mdc]] : blankGlyph;
	return {
		render: function(x, y) {
			return "<g transform='translate(" + x + "," + y + ")'>\
					<rect opacity='0' width='" + g.w  + "' height='" + g.h + "'/>\
					<path d='" + g.path + "'/></g>";
		},
		width: parseFloat(g.w),
		height: parseFloat(g.h)
	}
};