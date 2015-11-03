var KEY_ENTER = 13, 
	KEY_LEFT = 37,
	KEY_UP = 38, 
	KEY_RIGHT = 39, 
	KEY_DOWN = 40, 
	canvas = null, 
	ctx = null, 
	lastPress = null, 
	pause = true, 
	player = null, 
	food = null,
	score = 0;
	dir = 0,
	gameOver = true,
	wall = new Array(); 

window.requestAnimationFrame = (function () { 
	return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) { window.setTimeout(callback, 17); }; }()); 


document.addEventListener('keydown', function (evt) { 
lastPress = evt.which; }, 
false);


function Rectangle(x,y,width,height){
	this.x = (x == null) ? 0 : x;
	this.y = (y == null) ? 0 : y;
	this.width = (width == null) ? 0 : width;
	this.height = (height == null) ? this.width : height;

	//function interseccion
	this.intersects = function (rect){
		if(rect == null){
			window.console.warn('Falta parametros');
		}else{
			return (this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.y + this.height > rect.y);
		}
	};

	this.fill = function (ctx){
		if(ctx == null){
			window.console.warn('Falta parametros');
		}else{
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
}

function paint(ctx){
	//clear
	ctx.fillStyle ='#000';
	ctx.fillRect(0,0,canvas.width,canvas.height);

	//dibujando un player
	ctx.fillStyle = '#0f0';
	player.fill(ctx);

	//dibujando otro player
	ctx.fillStyle = '#f00'; 
	food.fill(ctx);

	ctx.fillText('Last Press:' + lastPress,0,20);

	//dibujando pause
	if(pause){
		ctx.textAlign = 'center';

		if (gameOver) {
			ctx.fillText('Game Over', 150,75);
		}else{
			ctx.fillText('PAUSE',150,75);
		}
		
		ctx.textAlign = 'left';
	} 

	//dibujando puntaje
	ctx.fillText('Score: '+ score, 0,10);

	//dibujando pared
	ctx.fillStyle = '#999';
	for (var i = 0; i < wall.length; i ++) {
		wall[i].fill(ctx);
	}
}

function act(){

	if (!pause) {
		if (gameOver) {
			reset();
		}

		//cambio de direccion
		if (lastPress == KEY_UP) { dir = 0;}
		if (lastPress == KEY_RIGHT) { dir = 1;}
		if (lastPress == KEY_DOWN) { dir = 2;}
		if (lastPress == KEY_LEFT) { dir = 3;}	

		//nos movemos dependiendo de la direccion tomada
		if (dir == 0) {player.y -= 10;}
		if (dir == 1) {player.x += 10;}
		if (dir == 2) {player.y += 10;}
		if (dir == 3) {player.x -= 10;}

		//verificando que no se salga de la screen
		if (player.x > canvas.width) {
			player.x = 0;
		}
		if (player.y > canvas.height) {
			player.y = 0;
		}
		if (player.x < 0) {
			player.x = canvas.width;
		}
		if (player.y < 0){
			player.y = canvas.height;
		}

		//si hay interseccion mover a otra posicion
		if(player.intersects(food)){
			score += 1;
			food.x = random(canvas.width / 10 - 1) * 10;
			food.y = random(canvas.height / 10 - 1) * 10;
		}
		//comprobando si hay interseccion con la pared
		for (var i = 0; i < wall.length ; i++) {
			if (food.intersects(wall[i])) {
				food.x = random(canvas.width /10 - 1) * 10;
				food.y = random(canvas.height / 10 - 1) * 10;
			}
			if (player.intersects(wall[i])) {
				pause = true;
			}	
		}
	}


	if (lastPress == KEY_ENTER) { 
		pause = !pause; 
		lastPress = null; 
	}
}

function reset(){
	score = 0;
	dir = 1;
	player.x = 40;
	player.y = 40;
	food.x = random(canvas.width / 10 - 1) * 10;
	food.y = random(canvas.height / 10 -1 ) * 10;
	gameOver = false;
 }

function repaint(){
	window.requestAnimationFrame(repaint);
	paint(ctx);
}

function run(){
	setTimeout(run,50); //llama la funcion run cada 50 milisegundos
	act();
}

function random(max){
	return Math.floor(Math.random() * max);
}


function init(){
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	//creanddo el player y food
	player = new Rectangle(40,40,10,10);
	food = new Rectangle(80,80,10,10);

	//creando una pared
	wall.push(new Rectangle(100,50,10,10));
	wall.push(new Rectangle(100,100,10,10));
	wall.push(new Rectangle(200,50,10,10));
	wall.push(new Rectangle(200,100,10,10));
	//empezando el juego
	run();
	repaint();

}

window.addEventListener('load',init,false);



