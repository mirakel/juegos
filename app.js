'use strict'

var canvas = null,
	context = null,
	lastUpdate = 0,
	FPS = 0,
	frames = 0,
	acumDelta = 0,
	x = 50,
	y = 50;

function paint(context){
	context.fillStyle = '#000';
	context.fillRect(0,0,canvas.width, canvas.height);

	context.fillStyle = '#0f0';
	context.fillRect(x,y,10,10);

	context.fillStyle = '#fff';
	context.fillText('FPS: '+ FPS,10,10);
}

function action(){
	x += 2;
	if(x > canvas.width){
		x = 0;
	}
}

function run(){
	window.requestAnimationFrame(run);

	var now = Date.now(), deltaTime = (now - lastUpdate) / 1000;
	if (deltaTime > 1) {
		deltaTime = 0;
	}
	lastUpdate = now;

	frames +=1;
	acumDelta += deltaTime;
	
	if (acumDelta > 1) {
		FPS = frames;
		frames = 0;
		acumDelta -= 1;
	}

	action();
	paint(context);
}

function init(){
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	run();
}

window.addEventListener('load',init,false);
