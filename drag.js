(function(window,undefined){
	'use strict';

window.addEventListener('load',init,false);

var lastPress = null,
	lastRelease = null, //momento en que soltamos el raton
	mouse = {x:0, y:0},
	pointer = {x:0, y:0},
	dragging = null, //elemento que estamos arrastrando
	draggables = [], //todos los elementos arrastables
	canvas = null,
	context = null;	

	function init(){
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvas.width = 200;
		canvas.height = 300;

		//creando 5 circulos en posiciones aleatorias
		for (var i = 0; i < 5; i++) {
			draggables.push(new Circle(random(canvas.width),random(canvas.height),10));		
		}

		//que empieze el juego
		enableInputs()
		run();
	}

	function run(){
		window.requestAnimationFrame(run);

		acciones();
		paint();

		lastPress = null;
		lastRelease = null;
	}

	function acciones(){

		//estableciendo los valores
		pointer.x = mouse.x;
		pointer.y = mouse.y;

		//estableciendo los limites dentro del canvas
		if (pointer.x < 0) {
			pointer.x = 0;
		}
		if (pointer.x > canvas.width) {
			pointer.x = canvas.width;
		}
		if (pointer.y < 0) {
			pointer.y = 0;
		}
		if (pointer.y > canvas.height) {
			pointer.y = canvas.height;
		}

		//encontrando si el cursor esta encima de un elemento arrastrable
		if (lastPress === 1) {
			for (var i = 0; i < draggables.length; i++) {
				if (draggables[i].distance(pointer) < 0) {
					dragging = i;
					break;
				}
			}
		}else if(lastRelease === 1){
			dragging = null;
		}

		//arrastrando el circulo
		if (dragging !== null) {
			draggables[dragging].x = pointer.x;
			draggables[dragging].y = pointer.y;
		}
	}

	function paint(){
		//limpiando
		context.fillStyle = '#000';
		context.fillRect(0,0,canvas.width,canvas.height);

		//dibujado circulos
		context.fillStyle = '#00f';

		for (var i = 0; i < draggables.length ; i++) {
			draggables[i].fill(context);
		}

		//debug
		context.fillStyle = '#0f0';
		context.fillRect(pointer.x-1,pointer.y-1,2,2);

		context.fillStyle = '#fff';
		context.fillText('dragging: '+ dragging,0,10);

	}

	function Circle(x,y,radio){
		this.x = (x === undefined)? 0:x;
		this.y = (y === undefined)? 0:y;
		this.radio = (radio === undefined)? 0:radio;
	}

	Circle.prototype.distance = function(circle){
		if (circle !== undefined) {
			var dx = this.x - circle.x;
			var dy = this.y - circle.y;
			var circleRadio = circle.radio || 0;

			return (Math.sqrt(dx*dx+dy*dy)-(this.radio+circleRadio));
		}
	}

	Circle.prototype.fill = function(context){
		if (context !== undefined) {
			context.beginPath();
			context.arc(this.x,this.y,this.radio,0,Math.PI*2,true);
			context.fill();
		}
	}


	function enableInputs(){
		document.addEventListener('mousemove',function(evt){
			mouse.x = evt.pageX - canvas.offsetLeft;
			mouse.y = evt.pageY - canvas.offsetTop;
		},false);

		document.addEventListener('mouseup',function(evt){
			lastRelease = evt.which;
		},false);

		canvas.addEventListener('mousedown',function(evt){
			evt.preventDefault();
			lastPress = evt.which;
		},false);
	}

	function random(max){
		return ~~(Math.random()*max);
	}

}(window));

