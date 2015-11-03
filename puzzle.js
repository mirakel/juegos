const PUZZLE_DIFFICULTY = 4;
const PUZZLE_HOVER_TINT = '#009900';

var canvas,
	context,
	image,
	pieces,
	puzzleWidth,
	puzzleHeight,
	pieceWidth,
	pieceHeight,
	currentPiece,
	currentDropPiece,
	mouse;


//Funciones
function init(){
	image = new Image();
	image.addEventListener('load',onImage,false);
	image.src = 'assets/pimpollo.jpg';
}

function onImage(){
	pieceWidth = Math.floor(image.width / PUZZLE_DIFFICULTY);
	pieceHeight = Math.floor(image.height / PUZZLE_DIFFICULTY);
	puzzleWidth = pieceWidth * PUZZLE_DIFFICULTY;
	puzzleHeight = pieceHeight * PUZZLE_DIFFICULTY;

	setCanvas();
	initPuzzle();
}

function setCanvas(){
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	canvas.width = puzzleWidth;
	canvas.height = puzzleHeight;
	canvas.style.border = '1px solid #000';	
}

function initPuzzle(){
	pieces = [];
	mouse = {x:0, y:0};
	currentPiece = null;
	currentDropPiece = null;
	context.drawImage(image,0,0,puzzleWidth,puzzleHeight,0,0,puzzleWidth,puzzleHeight);
	createTitle('click para empezar');
	buildPieces();
}

function createTitle(msg){
	context.fillStyle = '#000';
	context.globalAlpha = .4;
	context.fillRect(100,puzzleHeight-40,puzzleWidth-200,40);
	context.fillStyle = '#fff';
	context.globalAlpha = 1;
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.font = '20px Arial';
	context.fillText(msg, puzzleWidth/2,puzzleHeight-20);	
}

function buildPieces(){
	var i,
		piece,
		xPos = 0,
		yPos = 0;

	for (var i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++) {
		piece = {}; //creacion de un objeto
		piece.sx = xPos;
		piece.sy = yPos;
		pieces.push(piece);
		xPos += pieceWidth;

		if(xPos >= puzzleWidth){
			xPos = 0;
			yPos += pieceHeight;
		}
	}

	document.onmousedown = shufflePuzzle; //se dispara cuando el usuario hace cick
}

function shufflePuzzle(){
	pieces = shuffleArray(pieces); //barajar
	context.clearRect(0,0,puzzleWidth,puzzleHeight);

	var i,
		piece,
		xPos = 0;
		yPos = 0;

	for (var i = 0; i < pieces.length; i++) {
			piece = pieces[i];
			piece.xPos = xPos;
            piece.yPos = yPos;

            console.log(pieces[i]);
			context.drawImage(image,piece.sx,piece.sy,pieceWidth,pieceHeight,xPos,yPos,pieceWidth,pieceHeight);
			context.strokeRect(xPos, yPos, pieceWidth,pieceHeight);

			xPos += pieceWidth;

			if (xPos >= puzzleWidth) {
				xPos = 0;
				yPos += pieceHeight;
			}
		}
	document.onmousedown = onPuzzleClick;	
}

 function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function onPuzzleClick(e){
	if (e.layerX || e.layerX == 0 ) {
		mouse.x = e.layerX - canvas.offsetLeft;
		mouse.y = e.layerY - canvas.offsetTop;
	}
	else if(e.offsetX || e.offsetX == 0){
		mouse.x = e.offsetX - canvas.offsetLeft;
		mouse.y = e.offsetY - canvas.offsetTop;
	}

	currentPiece = checkPieceClicked();
	if (currentPiece != null) {
		context.clearRect(currentPiece.xPos,currentPiece.yPos, pieceWidth, pieceHeight);
		context.save();
		context.globalAlpha = 0.9;
		context.drawImage(image, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
		context.restore();
		document.onmousemove = updatePuzzle;
		document.onmouseup = pieceDropped;
	}
}

function checkPieceClicked(){
	var i,
		piece;

	for (var i = 0; i < pieces.length; i++) {
		piece = pieces[i];
		//determinar en que pieza se hizo click, mediante los limites de una pieza
		if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
            //PIECE NOT HIT
        }
        else{
            return piece;
        }
	}
	return null;
}

function updatePuzzle(e){
    currentDropPiece = null;

    if(e.layerX || e.layerX == 0){
        mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        mouse.x = e.offsetX - canvas.offsetLeft;
        mouse.y = e.offsetY - canvas.offsetTop;
    }

    context.clearRect(0,0,puzzleWidth,puzzleHeight);
    
    var i;
    var piece;
    
    for(i = 0;i < pieces.length;i++){
        piece = pieces[i];
        
        if(piece == currentPiece){
            continue;
        }

       context.drawImage(image, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
       context.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);

        if(currentDropPiece == null){
            if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
                //NOT OVER
            }
            else{
                currentDropPiece = piece;
                context.save();
                context.globalAlpha = 0.4;
                context.fillStyle = PUZZLE_HOVER_TINT;
                context.fillRect(currentDropPiece.xPos,currentDropPiece.yPos,pieceWidth, pieceHeight);
                context.restore();
            }
        }
    }
    context.save();
    context.globalAlpha = 0.6;
    context.drawImage(image, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
    context.restore();
    context.strokeRect(mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth,pieceHeight);
}

function pieceDropped(){
	document.onmousemove = null;
    document.onmouseup = null;
    
    if(currentDropPiece != null){
        var tmp = {xPos:currentPiece.xPos,yPos:currentPiece.yPos};
        currentPiece.xPos = currentDropPiece.xPos;
        currentPiece.yPos = currentDropPiece.yPos;
        currentDropPiece.xPos = tmp.xPos;
        currentDropPiece.yPos = tmp.yPos;
    }

    resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin(){
    context.clearRect(0,0,puzzleWidth,puzzleHeight);

    var gameWin = true;
    var i;
    var piece;

    for(i = 0;i < pieces.length;i++){
        piece = pieces[i];
        context.drawImage(image, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        context.strokeRect(piece.xPos, piece.yPos, pieceWidth,pieceHeight);
        
        if(piece.xPos != piece.sx || piece.yPos != piece.sy){
            gameWin = false;
        }
    }

    if(gameWin){
        setTimeout(gameOver,500);
    }
}

function gameOver(){
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    initPuzzle();
}