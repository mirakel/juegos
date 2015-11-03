(function(window,undefined){
	'use strict';

	window.addEventListener('load',init,false);

	var mousex = 0,
		mousey = 0,
		context = null,
		canvas = null,
		lastPress = null,
		score = 0,
		bgColor = '#000';

	var player = new Circle(0,0,5);
	var target = new Circle(100,100,10);

	function init(){
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvas.width = 300;
		canvas.height = 200;

		enableInputs();
		run();
	}

	function enableInputs(){
		document.addEventListener('mousemove',function(evt){
			mousex = evt.pageX - canvas.offsetLeft;
			mousey = evt.pageY - canvas.offsetTop;
		},false);


		document.addEventListener('mousedown',function(evt){
			lastPress = evt.which;
		},false);
	}

	function run(){
		requestAnimationFrame(run);
		acciones();
		paint(context);
	}	

	function paint(context){
		context.fillStyle=bgColor;
		context.fillRect(0,0,canvas.width,canvas.height);
		
		context.strokeStyle = '#0f0';
		player.stroke(context);
		
		context.strokeStyle = '#f00';
		target.stroke(context);

		context.fillStyle = '#fff';
		context.fillText('Distancia: ' + player.distance(target).toFixed(1),10,10);
		
		context.fillText('Puntaje: '+score,0,20);
		lastPress = null;
	}

	document.addEventListener('mousemove',function(evt){
		mousex = evt.pageX - canvas.offsetLeft; //obteniendo la posicion con respecto al canvas
		mousey = evt.pageY - canvas.offsetTop;

	}, false);

	
	function acciones(){
		player.x = mousex;
		player.y = mousey;

		if (player.x < 0) {
			player.x = 0;
		}
		if (player.x >canvas.width) {
			player.x = canvas.width;
		}
		if (player.y < 0) {
			player.y = 0;
		}
		if (player.y>canvas.height) {
			player.y = canvas.height;
		}

		if (lastPress == 1) {
			bgColor = '#333';
			if (player.distance(target) < 0) {
				score++;
				target.x = random(canvas.width/10-1)*10 + target.radio;
				target.y = random(canvas.height/10-1)*10+target.radio;	
			}else{
				bgColor = '#000';
			}
		}
	}

	function Circle(x,y,radio){
		this.x = (x == null) ? 0:x;
		this.y = (y == null) ? 0:y;
		this.radio = (radio == null) ? 0 :radio;	
	}

	Circle.prototype.stroke = function(context){
		context.beginPath();
		context.arc(this.x,this.y,this.radio,0,Math.PI*2,true);
		context.stroke();
	}

	Circle.prototype.distance = function(circle){
		if (circle != null) {
			var dx = this.x - circle.x;
			var dy = this.y - circle.y;
			return (Math.sqrt(dx*dx+dy*dy) - (this.radio + circle.radio));
		}
	}

	function random(max){
		return ~~(Math.random()*max);
	}
	
}(window));