(function(window, undefined){
	'use strict'

	window.addEventListener('load',init,false);

	var canvas = null,
		context = null,
		lastUpdate = 0,
		pause = true,
		lastPress = null,
		mousex = 0,
		mousey = 0,
		score = 0,
		counter = 0,
		bgColor = '#000',
		player = new Circle(0,0,5),
		target = new Circle(100,100,10),
		iSight = new Image(),
		iTarget = new Image();
		
		iSight.src = 'assets/serpiente.png',
		iTarget.src = 'assets/fruit.png';

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
			var deltaTime = (now-lastUpdate)/1000;
			if (deltaTime > 1) {
				deltaTime = 0;
			}

			lastUpdate = now;

			acciones(deltaTime);
			paint(context);
		}

		function random(max){
			return ~~(Math.random()*max);
		}

		function acciones(deltaTime){
			player.x = mousex;
			player.y = mousey;

			if (player.x < 0) {
				player.x = 0;
			}
			if (player.x > canvas.width) {
				player.x = canvas.width;
			}
			if (player.y < 0) {
				player.y = 0;
			}
			if (player.y > canvas.height) {
				player.y = canvas.height;
			}

			counter -= deltaTime;
			
			if (!pause) {
				
				if (lastPress == 1) {
					bgColor = '#333';

					if (player.distance(target) < 0) {
						score++;
						target.x = random(canvas.width/10 -1)*10 + target.radio;
						target.y = random(canvas.height/10 -1)*10 + target.radio;
					}
				}
				else{
					bgColor = '#000';
				}

				if (counter < 0) {
					pause = true;
				}
			}

			else if(lastPress == 1 && counter < -1){
				pause = false;
				counter = 15;
				score = 0;
			}
			lastPress = null;
		}

		function paint(context){
			context.fillStyle = bgColor;
			context.fillRect(0,0,canvas.width, canvas.height);

			context.strokeStyle = '#f00';
			target.drawImage(context,iTarget);
			context.strokeStyle = '#0f0';
			player.drawImage(context,iSight);

			context.fillStyle = '#fff';
			context.fillText('score:' + score,0,10);
			
			if (counter>0) {
				context.fillText('Time:' +counter.toFixed(1),250,10);
			}else{
				context.fillText('Time: 0.0',250,10);	
			}

			if (pause) {
				context.fillText('score: '+score,120,100);
				if(counter < -1)
					context.fillText('Click para empezar',100,120);
			}

		}

		function enableInputs(){
			document.addEventListener('mousemove',function(evt){
				mousex = evt.pageX - canvas.offsetLeft;
				mousey = evt.pageY - canvas.offsetTop;
			},false);

			canvas.addEventListener('mousedown',function(evt){
				lastPress = evt.which; //1,2,3
			},false);
		}

		function Circle(x,y,radio){
			this.x = (x == null)? 0: x;
			this.y = (y == null)? 0: y;
			this.radio = (radio == null)? 0:radio;

		}

		Circle.prototype.distance = function(circle){
			if (circle != null) {
				if (circle != null) {
					var dx = this.x - circle.x;
					var dy = this.y - circle.y;
					return (Math.sqrt(dx*dx+dy*dy) - (this.radio+circle.radio));
				}
			}
		}

		Circle.prototype.stroke = function(context){
			context.beginPath();
			context.arc(this.x, this.y,this.radio,0,Math.PI*2,true);
			context.stroke();
		}

		Circle.prototype.drawImage = function(context,image){
			if (image.width) {
				context.drawImage(image,this.x-this.radio,this.y-this.radio);
			}else{
				this.stroke(context);
			}
		}

}(window))