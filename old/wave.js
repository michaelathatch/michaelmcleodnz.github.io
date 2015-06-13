message=document.getElementById("waveText").innerHTML;
wavefunc=[-0.1,-0.4,-0.7,-1.0,-0.7,-0.4,-0.1];
pos=4;
function wave() {
	txt = "";
	for(i=0; i != message.length; i++) {
		if(i+pos > -1 && i+pos < 7) {
			txt += "<span style='position:relative;top:" + wavefunc[i+pos] + "em'>" + message.charAt(i) + "</span>";
		} else {
			txt += "<span>" + message.charAt(i) + "</span>";
		}
	}
	document.getElementById("waveText").innerHTML = txt;
	if(pos != (-message.length)) {
		pos--;
		setTimeout("wave()",50);
	} else {
		pos=4;
		setTimeout("wave()",50);
	}
}
wave();