window.onload = function() {
	document.getElementById("output").innerHTML = renderSingle(window.location.hash.substring(1), {fill:"#800", height:92});
	document.getElementById("signlist").innerHTML = renderSignList();
	document.getElementById("extended").innerHTML = renderAllSigns();
	listenAndDisplay("input","output");
};

window.onhashchange = function() {
	window.location.reload(true);
};

function listenAndDisplay(listenId, displayId) {
	var input = document.getElementById(listenId);
	if(input.addEventListener) {
		input.addEventListener("keyup", callback);
	} else if(input.attachEvent) {
		input.attachEvent("onkeyup", callback); //OldIE
	}
	function callback() {
		document.getElementById(displayId).innerHTML = renderSingle(input.value, {fill:"#800", height:92});
	}
}