(function(window,undefined){
	'use strict'

	window.addEventListener('load',init,false);
	
	var canvas = null,
		context = null,
		lastUpdate = 0,
		pause = true,
		gameOver = true,
		lastPress = null,
		counter = 0;

	function init(){
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvas.width = 300;
		canvas.height = 200;

		enableInputs();
		run();
	}

	function run(){
		requestAnimationFrame(run);

		var now = Date.now();
		var deltaTime = (now - lastUpdate)/1000;
		
		if (deltaTime > 1) {
			deltaTime = 0;
		}

		lastUpdate = now;

		acciones(deltaTime);
		paint(context);
	}

	function acciones(deltaTime){
		if (!pause) {

			counter -= deltaTime;
			if (counter <= 0) {
				counter = 0;
				gameOver = true;
				pause = true;
			}
		}
		else if(lastPress == 1){
			if (gameOver) {
				gameOver = false;
				counter = 5;
			}
			else{
				pause = false;
			}

			lastPress = null;
		}
	}

	function paint(context){
		context.fillStyle = '#000';
		context.fillRect(0,0,canvas.width, canvas.height);

		context.fillStyle = '#fff';
		context.textAlign = 'center';
		context.font='20px arial';
		context.fillText(counter.toFixed(1),150,100);

		if (pause) {
			context.font = '10px arial';
			
			if (gameOver) {
				context.fillText('click para reiniciar',150,120);
			}else{
				context.fillText('click para empezar',150,120);
			}
		}
	}

	function enableInputs(){
		canvas.addEventListener('mousedown',function(evt){
			lastPress = evt.which;
		},false);
	}


}(window));