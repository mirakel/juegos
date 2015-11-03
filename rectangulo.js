(function(window,undefined){
	'use strict'

	var canvas = null,
		lastPress = null,
		context = null,
		lastRelease = null,
		mouse = {x:0, y:0},
		pointer = {x:0, y:0},
		dragging = null,
		draggables = [];

	function Rectangle(x,y,width,height){
		this.x = (x === undefined)? 0:x;
		this.y = (y === undefined)? 0:y;
		this.width = (width === undefined)? 0:width;
		this.height = (height === undefined)? width: height;
	}

	Rectangle.prototype.contains = function (rect){
		if (rect !== undefined) {
			var rectWidth = rect.width || 0,
				rectHeight = rect.height || 0;

			return (this.x < rect.x && this.x + this.width > rect.x + rectWidth && this.y < rect.y && this.y + this.height > rect.y + rectHeight);	 
		}
	};

	Rectangle.prototype.interssects = function(rect){
		if (rect !== undefined) {
			return (this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.y + this.height > rect.y);	 
		}
	};

	Rectangle.prototype.fill = function(context){
		if (context !== undefined) {
			context.fillRect(this.x,this.y, this.width,this.height);
		}
	};

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

	function paint(){
		context.fillStyle = '#000';
		context.fillRect(0,0,canvas.width,canvas.height);

		//dibujando los rectangulos
		context.fillStyle = '#00f';
		for (var i = 0; i < draggables.length; i++) {
			draggables[i].fill(context);
		}

		//debug
		context.fillStyle = '#0f0';
		context.fillRect(pointer.x - 1, pointer.y -1,2,2);

		context.fillStyle = '#fff';
		context.fillText('Dragging: '+dragging,0,10);
	}

	function acciones(){
		pointer.x = mouse.x;
		pointer.y = mouse.y;

		//limites canvas
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

		if (lastPress === 1) {
			for (var i = draggables.length - 1; i >= 0; i--) {
				if (draggables[i].contains(pointer)) {
					dragging = i;
					break;
				}
			}
		}else if(lastRelease === 1){
			dragging = null;
		}

		if (dragging !== null) {
			draggables[dragging].x = pointer.x;
			draggables[dragging].y = pointer.y;
		}

	}

	function random(max){
		return ~~(Math.random()*max);
	}

	function run(){
		window.requestAnimationFrame(run);
		acciones();
		paint();

		lastPress = null;
		lastRelease = null;
	}

	function init(){
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');
		canvas.width = 200;
		canvas.height = 300;

		for (var i = 0; i < 5; i++) {
			draggables.push(new Rectangle(random(canvas.width),random(canvas.height),20,20));
		}

		enableInputs();
		run();
	}

	window.addEventListener('load',init,false);

}(window))