window.onload = function() {
	var dynamic = document.getElementById("dynamic");
	switch(window.location.hash.substring(1)) {
		case "gardiner":
			dynamic.innerHTML = renderSignList();
			break;
		case "allsigns":
			dynamic.innerHTML = renderAllSigns();
			break;
		case "hierojs":
			dynamic.innerHTML = "Type some <a href='http://www.catchpenny.org/codage/' target='_blank'>Manuel de Codage</a>\
								into the box to render it below:<br/><br/>\
								<input id='input' size='30' placeholder='MdC goes in here ...' style='line-height:1.2em'/>\
								<button id='reverse'>Reverse</button><br/><br/>\
								<div id='output'></div><p>Examples for inspiration: A1-A1 , anx-DA-s , [{-gm-D3-}] , Sms-hrw-nfr .\
								<br/>(Only the '-' and '*' operators are currently implemented.)</p>";
			document.getElementById("output").innerHTML = renderLine(input.value, {fill:"#201", height:92});
			listenAndDisplay("input","output","reverse");
			break;
		case "dickson":
			dynamic.innerHTML = "Search the Dickson Dictionary by transliteration:<br/><br/>\
								<input id='input' size='30' placeholder='Transliteration goes in here ...' style='line-height:1.2em'/>\
								<button id='search'>Search</button>\
								<div id='output' style='text-align:left'></div>";
			listenSearchAndDisplay("input","output");
			break;
		default:
			if(isGlyph(window.location.hash.substring(1))) {
				dynamic.innerHTML = renderSingle(window.location.hash.substring(1), {fill:"#201", height:128});
			} else {
				dynamic.innerHTML = '<svg width="100" height="75" viewBox="0 0 256 192" stroke="#000" stroke-width="2"><path d="m102.1 70.26c3.668 8.3 6.5 24.11-4.698 35.86-17.22 18.02-49.79 54.79-51.04 78.3 15.3 0.8 23.16-4.524 43.47-0.6547l69.3 1.422c26.3-6.627 46.9 3.3 77.3 3 1.527-86.81-1.122-136.9-81.55-174.4" fill="#e9ddaf"/><path d="M81.37 41.03c-0.23-41.72 53.13-46.92 89.73-16.55 8.5 7.1 41 30.8 25 86.79-5.305 18.57-24.33 35.13-36.63 73.97-30.52 6.758-49.5 3.251-69.44-1.375 1.006-12.83 3.162-27.59 20.86-34.27 32.09-12.13 60.49-38.22 62.5-62.87 1.393-17.1-9.979-33.32-22.85-32.63-13.28 0.7135-13.34 16.58-38.72 17.46-11.47 0.3987-15.8-4.994-17.72-9.04" fill="#917c6f"/><path d="m99.66 33.39c4.356-0.2398 11.8 0.4 18.3 3.1 5.329-4.277 10.94-6.878 19.25-8.814-17.86-3.522-25.95-6.036-32 5.7" fill="#005522"/><path d="M11.22 162.9c-5.241 5.9-7.385-5.1-6.615-18.2-1.23 0.2-2.475 0.5-3.605 1.1 1.624-9.222 0.4289-24.93 10.09-28.22 15.61-5.436 14.8 35.9 0.1 45.32z" fill="#e8a95a"/><path d="m250 101.5c5.987 2 5.3 21.6 5.7 52.52-2.021-1.808-3.636-2.387-5.521-3.316-1.245 16.7-7.591 32.07-12.55 23.8-10.88-12.71-8.545-78.66 12.39-73.01z" fill="#e8a95a"/><path d="m11.45 121.3 6.541-2.464c6.424 6.5 5.5 22.5 1.7 31.87l-9.138 6.8" fill="#f7be5a"/><path d="m249.4 109.2-9.628-3.528c-9.786 11.2-9.579 44.6-7.343 54.01l9.516 9.3" fill="#f7be5a"/><path d="m11.85 121.2c6.806-0.2496 4.5 36.72-2.847 36.81-5.305 0.0616-5.784-36.49 2.847-36.81z" fill="#e8a95a"/><path d="m249.6 109.2c5.961 0.9 1.7 59.89-7.151 59.81-8.052-0.0806-3.047-61.43 7.151-59.81z" fill="#e8a95a"/><path d="M249.8 101.5c-43.3-14.94-144.5-17.97-238.2 15.9 10.2 2.4 12.6 24.14-0.6218 45.8 30.87-21.34 59.65-38.19 111-42.17 44.77-3.471 76 4.9 115.7 53.48-5.164-17.96-1.644-71.82 12.22-73.06z" fill="#f7be5a"/><path d="m230.3 96.27c-1.872-3.699-4.638-2.665-7.64-1.229-18.01 13.24-22.12 47.78-4.769 63.1 0.7 8.26-0.2824 14.42-2.299 20.6 1.6 1.1 3.3 2.3 5.1 4 0.003-10.74 1.914-15.23 0.8218-23.3 0.9 0.1 1.7 0 2.525-0.1061-20.75-17.19-10.48-56.07 6.302-62.99z" fill="#552200"/><path d="m18.19 115c0.74-1.616 1.974-2.41 4.467-1.334 9.4 8.4 8.2 51.4 0.2 51.24-2.959-0.0419-3.885-3.843-4.217-6.803l2.921-1.962c-0.03877 1.984-0.1336 4.5 1.1 4.6 3.8 0.3 6.454-38.3-4.458-45.78z" fill="#552200"/><path d="m17.08 159.3c-0.3525 8.5 1.6 15.3 1.5 22.53-1.428-2.463-2.961-3.911-4.41-4.913 0.3264-4.616-0.6495-9.723-0.2876-15.41z" fill="#552200"/><path d="m78.83 105.3c-1.478-2.489-3.378-4.415-5.657-5.082 5.007-13.89 7.671-14.05 20.9-6.232 2.653-2.534 3.76-1.904 5.465-0.6712 13.98-11.62 29.03-15.14 49.88-4.478 1.511-1.813 3.774-1.606 5.285-0.2198 6.013-4.184 9.499-9.502 11.95-14.96 3.39-0.298 6.59-1.023 9.801-2.21-6.211 7.407-12.99 15.78-21.79 19.76-4.557 8.245-4.374 19.75-0.0959 30.11-1.814 1.031-3.381 1.27-5.201-0.615-3.687-7.869-3.576-22.3-0.5123-29.3-23.04-9.992-32.4-6.435-48.75 4.4 3.5 11 1.7 22.65-2.713 28.38-1.579 2.072-3.704 1.75-4.958 1 2.328-4.214 8.079-19.11 1.845-28.09-17.42-9.295-14.1-1.788-15.46 8.246z" fill="#552200"/><path d="M94.23 62.68c-1.61-0.41-24.63 2.68-37.52 16.73-16.52 18.01-14.67 52.09-5.33 78.69-22.29-19.9-27.61-64.89-10.97-85.78 14.95-18.78 26.04-18.15 41.67-31.34 8.2 3.5 14.5 5.2 12.2 21.69z" fill="#784421"/><path d="M92.56 48.32c-4.49 4.51-16.5 11.87-22.78 14.53-9.47 4.01-25.05 14.24-29.41 36.52-2.089 10.69-4.843 34.5 10.5 57.2" fill="none"/></svg>';
			}
			break;
	}
};

window.onhashchange = function() {
	window.location.reload(true);
};

var addEvent = (function() {
	if(document.addEventListener) {
		return function(el, ev, callback) {
			document.getElementById(el).addEventListener(ev, callback);
		}
	} else if(document.attachEvent) { //OldIE
		return function(el, ev, callback) {
			document.getElementById(el).attachEvent("on" + ev, callback);
		}
	}
})();

function listenAndDisplay(listenId, displayId, buttonId) {
	var rev = false;
	addEvent(listenId, "keyup", callback);
	addEvent(buttonId, "click", flip);
	function callback() {
		document.getElementById(displayId).innerHTML = render(input.value, {fill:"#201", height:92, reverse:rev});
	}
	function flip() {
		rev = !rev;
		document.getElementById(displayId).innerHTML = render(input.value, {fill:"#201", height:92, reverse:rev});
	}
}

function listenSearchAndDisplay(listenId, displayId) {
	var wait = false;
	addEvent(listenId, "keyup", edited);
	renderAsTransliteration(document.getElementById(listenId));
	function edited() {
		if(!wait) {
			wait = true;
			setTimeout(callback, 500);
		}
	}
	function callback() {
		document.getElementById(displayId).innerHTML = findAndRenderMatches(untransliterate(input.value, true), {fontSize:"1.5em", height:32, highlight:"#e7d070"});
		wait = false;
	}
}