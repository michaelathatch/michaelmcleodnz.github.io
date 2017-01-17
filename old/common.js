//Library of common JavaScript operations, like a cheap jQuery.

//Wrapper function for DOM-reliant code
//erring heavily on the side of caution
//Usage: ready(function(){ /*code*/ });
function ready(callback) {
	if(window.addEventListener) {
		var handler = function() {
			document.removeEventListener("DOMContentLoaded", handler);
			window.removeEventListener("load", handler);
			callback();
		};
		document.addEventListener("DOMContentLoaded", handler);
		window.addEventListener("load", handler);
	} else if(window.attachEvent) {
		var handler1 = function() {
			if(document.readyState == "complete") {
				document.detachEvent("onreadystatechange", handler1);
				window.detachEvent("onload", handler2);
				callback();
			}
		};
		var handler2 = function() {
			document.detachEvent("onreadystatechange", handler1);
			window.detachEvent("onload", handler2);
			callback();
		};
		document.attachEvent("onreadystatechange", handler1);
		window.attachEvent("onload", handler2);
	} else {
		var windowonload = window.onload;
		window.onload = function() {
			windowonload && windowonload();
			callback();
		};
	}
}

//Universal event handler, erring as above
//Usage: addEvent(element, event, callback);
var addEvent = (function() {
	if(window.addEventListener) {
		return function(el, ev, callback) {
			el.addEventListener(ev, callback);
		}
	} else if(window.attachEvent) {
		return function(el, ev, callback) {
			el.attachEvent("on" + ev, callback);
		}
	} else {
		return function(el, ev, callback) {
			var event = el["on" + ev];
			el["on" + ev] = function() {
				event && event();
				callback();
			};
		}
	}
})();

//Universal event handler specialising in IDs
//Usage: addEventById(elementId, event, callback);
var addEventById = (function() {
	if(window.addEventListener) {
		return function(el, ev, callback) {
			document.getElementById(el).addEventListener(ev, callback);
		}
	} else if(window.attachEvent) {
		return function(el, ev, callback) {
			document.getElementById(el).attachEvent("on" + ev, callback);
		}
	} else {
		return function(el, ev, callback) {
			var event = document.getElementById(el)["on" + ev];
			document.getElementById(el)["on" + ev] = function() {
				event && event();
				callback();
			};
		}
	}
})();

//Standard AJAX call
function ajax(method, url, callback, data) {
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhr.open(method, url, true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && xhr.status == 200) {
			callback(xhr);
		}
	};
	if(method == 'POST') {
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(data);
	} else {
		xhr.send();
	}
}

//Synchronous AJAX call
function jax(method, url, callback, data) {
	var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	xhr.open(method, url, false);
	if(method == 'POST') {
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(data);
	} else {
		xhr.send();
	}
	if(xhr.status == 200) {
		callback(xhr);
	}
}

//Include another JavaScript file
//Note: this obviously can't be used to load itself.
//Not that it should ever be used in production environments anyway,
//where all the code would be minified to a single file.
function require(url) {
	if(window.XMLHttpRequest) {
		var xhr = new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		var xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhr.open('GET', url, false);
	xhr.send();
	if(xhr.status == 200) {
		//Don't panic: this is exactly the situation eval was designed for.
		eval.apply(window, [xhr.responseText]);
	}
}

//Add properties to an object if they are not already present
//Usage: newObj = extend(oldObj, {property: defaultValue, ... });
function extend(obj, defaults) {
	var obj = obj || defaults;
	for(var prop in defaults) {
		obj[prop] = typeof(obj[prop]) !== 'undefined' ? obj[prop] : defaults[prop];
	}
	return obj;
}

//Remove properties from an object
//Usage: newObj = extend(oldObj, [properties]);
function without(obj, deletions) {
	var newObj;
	for(var prop in obj) {
		if(deletions.indexOf(prop) === -1) {
			newObj[prop] = obj[prop];
		}
	}
	return newObj;
}

//Swap an object's keys and values
function invert(obj) {
	var result = {};
	for (var prop in obj) {
		if(obj.hasOwnProperty(prop)) {
			result[obj[prop]] = prop;
		}
	}
	return result;
}

//Convert the contents of a string using a lookup table
//E.g. for transliteration
function convert(str, table) {
	//For ES5 supporters (here's looking at you, IE8):
	if(Object.keys && Array.prototype.map) {
		var keys = Object.keys(table);
		var regex = new RegExp(keys.map(function(key) {
			return key.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');	//escape for regex
		}).join('|'), 'g');
		return str.replace(regex, function(c) {
			return table[c] || c;	//replace all keys with values, else keep the same
		});
	//Polyfill:
	} else {
		var keys = (function(obj) {
			var keys = [];
			for(var key in obj) {
				if(obj.hasOwnProperty(key)) {
					keys.push(key);
				}
			} return keys;
		})(table);
		for(var key in keys) {
			keys[key] = keys[key].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
		}
		var regex = new RegExp(keys.join('|'), 'g');
		return str.replace(regex, function(c) {
			return table[c] || c;
		});
	}
}