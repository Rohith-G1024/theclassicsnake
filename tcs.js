// import Math;
// board config
var blockSize = 25;
var rows = 20;
var cols = 20;
var xlimit = blockSize * cols
var ylimit = blockSize * rows
var context, outercontext, board, interval;

var gameOver = false;

// var bounded = true;
var paused = false;
var bounded = false;
//snake config

//snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var snakeBody = [];

//set speed of snake
var time = 1.5

var speedX = 0;
var speedY = 0;

//food config
var foodX;
var foodY;

window.onload = function() {
	outerboard = document.getElementById("outerboard");


	board = document.getElementById("innerboard")
	board.height = xlimit;
	board.width = ylimit;
	context = board.getContext("2d");

	if(bounded){
		outerboard.style.backgroundColor = "grey";
	}
	else {
		outerboard.style.backgroundColor = "white"
		// outercontext.fillStyle = "white";
		// outercontext.fillRect(0,0,outerboard.height,outerboard.width);
	}
	

	//place food at random location
	dropfood();
	//check for input for changing direction in snake
	document.addEventListener("keyup",changeDirection)
	//moving snake
	context.fillStyle = "black";
	context.fillRect(0, 0, board.height, board.width);

	update();
	interval = setInterval(update, 1000/(5*time));
	if (gameOver) clearInterval(interval);
}

function update() {

	if(gameOver) return;

	context.fillStyle = "black";
	context.fillRect(0, 0, board.height, board.width);

	context.fillStyle = "red";
	context.fillRect(foodX, foodY, blockSize, blockSize);

	//when snake "eats" food
	if(snakeX==foodX && snakeY==foodY)
	{
		snakeBody.push([foodX,foodY]);
		dropfood();
	}

	//snake body should stay as one unit
	for(let i = snakeBody.length - 1; i>0; i--)
	{
		snakeBody[i] = snakeBody[i-1];
	}

	// adjusting starting bit of snake body when head moves
	if(snakeBody.length){
		snakeBody[0] = [snakeX,snakeY];
	}

	//updating snake direction
	snakeX += speedX * blockSize;
	snakeY += speedY * blockSize;

	// if snake goes out of bounds in infinity mode
	if(!bounded){
		if(snakeX<0) snakeX = xlimit - blockSize
		else if(snakeY<0) snakeY = ylimit - blockSize
		else if(snakeX>=xlimit) snakeX = 0
		else if(snakeY>=xlimit) snakeY = 0
	}

	//snake body color
	context.fillStyle = "green";
	for(let i = 0 ; i<snakeBody.length; i++)
	{
		context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
	}

	//snake head color
	context.fillStyle = "lime"
	context.fillRect(snakeX, snakeY, blockSize, blockSize);

	checkGameOver();
	// console.log("here")
}

function changeDirection(e) {
	// console.log(e.code)

	//check if user wishes to pause/unpause
	if(e.code=="Space"){
		// console.log(time, interval);
		if(paused){
			paused = false;
			interval = setInterval(update, 1000/(5*time));
		}
		else{
			paused = true;
			clearInterval(interval);
			interval = 0;
		}
	}

	else if (!paused){
		switch (e.code) {
			case "ArrowUp":
				if(Math.abs(speedY) == 1) return;
				speedX = 0;
				speedY = -1;
				break;
	
			case "ArrowDown":
				if (Math.abs(speedY) == 1) return;
				speedX = 0;
				speedY = 1;
				break;
		
			case "ArrowLeft":
				if(Math.abs(speedX) == 1) return;
				speedX = -1;
				speedY = 0;
				break;
	
			case "ArrowRight":
				if(Math.abs(speedX) == 1) return;
				speedX = 1;
				speedY = 0;
				break;
	
		}
		clearInterval(interval);
		update();
		interval = setInterval(update, 1000/(5*time));
	}




}

function dropfood() {
	foodX = Math.floor(Math.random() * cols) * blockSize;
	foodY = Math.floor(Math.random() * rows) * blockSize;
}

function checkGameOver(){
	//check for gameover conditions
	//snake hits wall boundaries
	if(bounded == true && (snakeX < 0 || snakeY < 0 || snakeX >= xlimit || snakeY >= ylimit))
	{
		gameOver = true;
		//display gameover
		alert("GAME OVER");
	}

	//snake "bites" itself
	for (let i = 0; i<snakeBody.length; i++){
		if(snakeBody[i][0]==snakeX && snakeBody[i][1]==snakeY){
			// console.log("snakeX = ", snakeX, "\nsnakeY = ", snakeY, "\nsnakebody = ", JSON.stringify(snakeBody))
			gameOver = true;
			alert("GAME OVER")
		}
	}
}