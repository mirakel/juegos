var KEY_ENTER = 13, 
	KEY_LEFT = 37,
	KEY_UP = 38, 
	KEY_RIGHT = 39, 
	KEY_DOWN = 40, 
	canvas = null, 
	ctx = null, 
	lastPress = null, 
	pause = true,  
	food = null,
	band = false,
	score = 0;
	dir = 0,
	gameOver = true,
	serpiente = new Array(),
	iSerpiente = new Image(),
	iFood = new Image(),
	aEat = new Audio(),
	aDie = new Audio(); 

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
			window.console.warn('Falta parametros insert');
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

	//dibujando la serpiente
	//ctx.fillStyle = '#0f0';
	for (var i = 0; i < serpiente.length; i++) {
		//serpiente[i].fill(ctx);
		ctx.drawImage(iSerpiente,serpiente[i].x,serpiente[i].y);
	}

	//dibujando la comida
	ctx.fillStyle = '#fff'; 
	//food.fill(ctx);
	ctx.drawImage(iFood,food.x, food.y);

	//dibujando pause
	if(pause){
		ctx.textAlign = 'center';

		if (gameOver) {
			ctx.fillText('Game Over',  canvas.width/2 - 50,canvas.height/2 - 10);
		}else{
			ctx.fillText('PAUSE', canvas.width/2 - 50,canvas.height/2 - 10);
		}
		
		ctx.textAlign = 'left';
	} 

	//dibujando puntaje
	ctx.fillText('Puntaje: '+ score, canvas.width-60,10);

	if(band){
		ctx.fillText('TE AMO PIMPO!!', canvas.width/2 - 50,canvas.height/2);
	} 
}

function act(){

	if (!pause) {
		if (gameOver) {
			reset();
		}

		//moviendo la serpiente
		for (var i = serpiente.length - 1; i > 0; i--) {
			serpiente[i].x = serpiente[i-1].x;
			serpiente[i].y = serpiente[i-1].y;	
		}

		//cambio de direccion
		if (lastPress == KEY_UP && dir != 2) { dir = 0;}
		if (lastPress == KEY_RIGHT && dir != 3) { dir = 1;}
		if (lastPress == KEY_DOWN && dir != 0) { dir = 2;}
		if (lastPress == KEY_LEFT && dir != 1) { dir = 3;}	

		//nos movemos dependiendo de la direccion tomada
		if (dir == 0) {serpiente[0].y -= 10;}
		if (dir == 1) {serpiente[0].x += 10;}
		if (dir == 2) {serpiente[0].y += 10;}
		if (dir == 3) {serpiente[0].x -= 10;}

		//verificando que no se salga de la pantalla
		if (serpiente[0].x > canvas.width - serpiente[0].width) {
			serpiente[0].x = 0;
		}
		if (serpiente[0].y > canvas.height - serpiente[0].height) {
			serpiente[0].y = 0;
		}
		if (serpiente[0].x < 0) {
			serpiente[0].x = canvas.width - serpiente[0].width;
		}
		if (serpiente[0].y < 0){
			serpiente[0].y = canvas.height - serpiente[0].height;
		}

		
		//si el cuerpo de la serpiente choca con la cabeza
		for (var i = 2; i < serpiente.length; i++) {
			if (serpiente[0].intersects(serpiente[i])) {
				gameOver = true;
				pause = true;
				aDie.play();
			}
		}

		//si hay interseccion mover a otra posicion
		if(serpiente[0].intersects(food)){
			score += 1; band = true;
			//Agregando un rectangulo a la serpiente al chocar con la manzana
			serpiente.push(new Rectangle(food.x,food.y,10,10));

			food.x = random(canvas.width / 10 - 1) * 10;
			food.y = random(canvas.height / 10 - 1) * 10;
			aEat.play();
		}else{
			//band = false;
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
	serpiente.length = 0;
	serpiente.push(new Rectangle(40,40,10,10));
	serpiente.push(new Rectangle(0,0,10,10));
	serpiente.push(new Rectangle(0,0,10,10));

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

	//cargando las imagenes
	iSerpiente.src = 'assets/serpiente.png';
	iFood.src = 'assets/fruit.png';

	//Agregando los audios
	aEat.src = 'assets/chomp.oga';
	aDie.src = 'assets/dies.oga';

	//creanddo el food
	food = new Rectangle(80,80,10,10);

	//empezando el juego
	run();
	repaint();

}

window.addEventListener('load',init,false);



