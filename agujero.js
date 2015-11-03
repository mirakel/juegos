(function(window,undefined){

	var canvas = null,
		context = null,
		spritesheet = new Image(),
		mouse = {x:0, y:0},
		pointer = {x:0, y:0},
		dragging = null, //elemento que estamos arrastrando
		draggables = [], //todos los elementos arrastables
		lastPress = null,
		lastRelease = null, //momento en que soltamos el raton
		counter = 0,
		score = 0,
		pause = true,
		lastUpdate = 0,
		hole = null;

	spritesheet.src = 'assets/draganddrop.png';

	window.addEventListener('load',init,false);

	function init(){
		canvas = document.getElementById('canvas');
		canvas.style.background = '#9cc';
		context = canvas.getContext('2d');
		canvas.width = 200;
		canvas.height = 300;

		hole = new Circle(canvas.width / 2, canvas.height / 2, 20);

		enableInputs();
		run();
	}

	function run(){
		window.requestAnimationFrame(run);
		
		var now = Date.now();
		var deltaTime = (now-lastUpdate)/1000;
		
		if (deltaTime > 1) {
			deltaTime = 0;
		}

		lastUpdate = now;

		acciones(deltaTime);
		paint();
		lastPress = null;
		lastRelease = null;

	}

	function acciones(deltaTime){
		pointer.x = mouse.x;
		pointer.y = mouse.y;

		//estableciendo los limites dentro del canvas
		if (pointer.x < 0) {
			pointer.x = 0
		}
		if (pointer.x > canvas.width) {
			pointer.x = canvas.width
		}
		if (pointer.y < 0) {
			pointer.y = 0
		}
		if (pointer.y > canvas.height) {
			pointer.y = canvas.height
		}

		counter -= deltaTime;

        if (lastPress === 1 && counter < -1) {
            reset();

        }

        if(!pause) {

        	for (i = 0; i < draggables.length; i++) {
                // Fall into hole
                if (draggables[i].distance(hole) < 0) {
                    draggables[i].x = hole.x;
                    draggables[i].y = hole.y;
                    draggables[i].radio -= deltaTime * 20;
                    
                    // Reset ball somewhere else
                    if (draggables[i].radio < 1) {
                        draggables[i].x = random(canvas.width);
                        draggables[i].y = random(canvas.height);
                        draggables[i].radio = 20;
                        score += 1;
                    }
                } else if (draggables[i].radio > 10) {
                    // Fall to ground
                    draggables[i].radio -= deltaTime * 20;
                }
                
                //encontrando si el cursor esta encima de un elemento arrastrable
                if (lastPress === 1) {
                    if (draggables[i].distance(pointer) < 0) {
                        dragging = i;
                        break;
                    }
                }
            }

        // Release current dragging circle
        if (lastRelease === 1) {
            dragging = null;
        }

		//arrastrando el circulo
		if (dragging !== null) {
			draggables[dragging].x = pointer.x;
            draggables[dragging].y = pointer.y;
            draggables[dragging].radio = 12;
		}

		// End game
        if (counter <= 0) {
            pause = true;
        }

       }
	}

	function paint(){

		context.clearRect(0, 0, canvas.width, canvas.height);

        hole.drawImageArea(context, spritesheet, 40, 0, 40, 40);
        
       	//dibujado circulos
        context.fillStyle = '#00f';

        for (i = 0; i < draggables.length; i++) {
            draggables[i].drawImageArea(context, spritesheet, 0, 0, 40, 40);
        }
        
        // HUD
        context.fillStyle = '#fff';
        context.fillText('Score: ' + score, 0, 10);

        if (counter > 0) {
            context.fillText('Time: ' + counter.toFixed(1), 150, 10);
        } else {
            context.fillText('Time: 0.0', 150, 10);
        }

        if (pause) {
            context.textAlign = 'center';
            context.fillText('DRAG & DROP', 100, 135);

            if (counter < -1) {
                context.fillText('CLICK TO START', 100, 155);
            }

            context.fillText('Score: ' + score, 100, 175);
            context.textAlign = 'left';
        }

	}

	function Circle(x,y,radio){
		this.x = (x === undefined)? 0: x;
		this.y = (y === undefined)? 0: y;
		this.radio = (radio === undefined)? 0: radio;
	}

	Circle.prototype.distance = function(circle){
		if (circle !== undefined) {
			var dx = this.x - circle.x;
			var dy = this.y - circle.y;
			var radioCircle = circle.radio || 0;

			return (Math.sqrt(dx*dx + dy*dy) - (this.radio + radioCircle));
		}
	};

	Circle.prototype.fill = function(context){
		if (context !== undefined) {
			context.beginPath();
			context.arc(this.x, this.y, this.radio,0,Math.PI*2,true);
			context.fill();			
		}
	};

	Circle.prototype.drawImageArea = function (context, img, sx, sy, sw, sh) {
		if (img.width) {
			context.drawImage(img, sx, sy, sw, sh, this.x - this.radio, this.y - this.radio, this.radio * 2, this.radio * 2);
		}else{
			this.fill(context);
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
			lastPress = evt.which;
		},false);

	}

	function random(max){
		return ~~(Math.random()*max);
	}

	function reset() {
        draggables.length = 0;

        for (i = 0; i < 5; i += 1) {
            draggables.push(new Circle(random(canvas.width), random(canvas.height), 20));
        }

        counter = 15;
        score = 0;
        pause = false;
    }


}(window))