var Canvas = require("canvas");
global.Image = Canvas.Image;

let inputStage = {};
let mazeSize = 5;
let newMaze = false;
let showSP = false;
let showHint = false;
let mazeRender = false;

function clock(start){
	if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}

var start = clock();
// let previousTime = performance.now();
// let totalTime = performance.now();
let previousTime = clock(start);
let totalTime = clock(start);
let ShortestPathFromMyLocation = []
let highScores = []

let score = 0;

let imgFloor = new Image();
imgFloor.isReady = false;
imgFloor.onload = function() {
	this.isReady = true;
};
imgFloor.src = 'floor2.jpg';

let imgCrumb = new Image();
imgCrumb.isReady = false;
imgCrumb.onload = function() {
	this.isReady = true;
}
imgCrumb.src = 'crumb.png';

let imgHint = new Image();
imgHint.isReady = false;
imgHint.onload = function() {
	this.isReady = true;
}
imgHint.src = 'hint.jpg';

let imgEnd = new Image();
imgEnd.isReady = false;
imgEnd.onload = function() {
	this.isReady = true;
};
imgEnd.src = 'end.png';

function createCharacter(imageSource, location) {
	let image = new Image();
	image.isReady = false;
	image.onload = function() {
		this.isReady = true;
	};
	image.src = imageSource;
	return {
		location: location,
		image: image
	};
}

let maze = [];
for (let row = 0; row < mazeSize; row++) {
	maze.push([]);
	for (let col = 0; col < mazeSize; col++) {
		maze[row].push({
			x: col, y: row, edges: {
				n: null,
				s: null,
				w: null,
				e: null
			},
			visited: false
		});
	}
	maze[0][0].visited = true
}

function changeSize(size){
	score = 0;
	totalTime -= totalTime
	// previousTime = performance.now()
	previousTime = clock(start);
	document.getElementById("score").innerHTML = score;
	mazeSize = size
	maze = [];
	for (let row = 0; row < mazeSize; row++) {
		maze.push([]);
		for (let col = 0; col < mazeSize; col++) {
			maze[row].push({
				x: col, y: row, edges: {
					n: null,
					s: null,
					w: null,
					e: null
				},
				visited: false
			});
		}
	}
	maze[0][0].visited = true
	newMaze = true;
	createMaze(size)
}

function findShortestPath(yLocation, xLocation){
	let foundMe = false
	let x = mazeSize - 1
	let y = mazeSize - 1
	let visited = [maze[y][x]]
	let shortestPath = []
	while(foundMe == false){
		if(y == yLocation && x == xLocation){
			foundMe = true;
		}
		else{
			if(maze[y][x].edges.n != null && visited.indexOf(maze[y-1][x]) == -1){
				shortestPath.push(maze[y-1][x])
				visited.push(maze[y-1][x])
				y -= 1
			}
			else if(maze[y][x].edges.e != null && visited.indexOf(maze[y][x + 1]) == -1){
				shortestPath.push(maze[y][x + 1])
				visited.push(maze[y][x + 1])
				x += 1
			}
			else if(maze[y][x].edges.s != null && visited.indexOf(maze[y + 1][x]) == -1){
				shortestPath.push(maze[y + 1][x])
				visited.push(maze[y + 1][x])
				y += 1
			}
			else if(maze[y][x].edges.w != null && visited.indexOf(maze[y][x - 1]) == -1){
				shortestPath.push(maze[y][x - 1])
				visited.push(maze[y][x - 1])
				x -= 1
			}
			else{
				shortestPath.pop()
				try{
					x = shortestPath[shortestPath.length -1].x
					y = shortestPath[shortestPath.length -1].y
				}
				catch(err){
					
				}
			}
		}
	}
	ShortestPathFromMyLocation = shortestPath
}
// Randomized Prim's Algorithm //

function createMaze(size){
	mazeRender = true;
	showHint = false
	showSP = false
	//Adds all available walls when a new cell of the maze is visited
	function addWalls(mazeCell){
		for(let i = 0; i < 1; i++){
			if(mazeCell.edges.n == null){
				let northWall = {x: mazeCell.x, y: mazeCell.y, wall: 'n'}
				wallList.push(northWall)
			}
			if(mazeCell.edges.e == null){
				let eastWall = {x: mazeCell.x, y: mazeCell.y, wall: 'e'}
				wallList.push(eastWall)
			}
			if(mazeCell.edges.s == null){
				let southWall = {x: mazeCell.x, y: mazeCell.y, wall: 's'}
				wallList.push(southWall)
			}
			if(mazeCell.edges.w == null){
				let westWall = {x: mazeCell.x, y: mazeCell.y, wall: 'w'}
				wallList.push(westWall)
			}
		}
	}

	//Removes a wall from the wall list
	function removeWall(wall){
		wallList.splice(wallList.indexOf(wall), 1)
	}

	
	//Keep Track of what has already been added to the maze
	let partOfMaze = [];
	for(let i = 0; i < mazeSize; i++){
		partOfMaze.push([])
		for(let j = 0; j < mazeSize; j++){
			partOfMaze[i].push(0)
		}
	}

	//Keep Track of All Walls
	let wallList = [];

	//Randomly select Starting Point for Algorithm
	let randomRow = Math.floor(Math.random()*mazeSize)
	let randomCol = Math.floor(Math.random()*mazeSize)

	//Adds walls of randomly selected first cell
	addWalls(maze[randomRow][randomCol])

	//generates maze and runs loop until all walls available are gone
	while(wallList.length > 0){
		//pick a random wall from the list
		
		// let randomWall = Math.floor(Math.random()*4)
		let randomWall = Math.floor(Math.random()*wallList.length)
		// let randomWall = 0
		if(wallList[randomWall].wall == 'n'){
			//check north
			try{
				if(partOfMaze[wallList[randomWall].y - 1][wallList[randomWall].x] == 0){
					//create a connection if there wasn't one
					maze[wallList[randomWall].y][wallList[randomWall].x].edges.n = maze[wallList[randomWall].y - 1][wallList[randomWall].x]
					maze[wallList[randomWall].y - 1][wallList[randomWall].x].edges.s = maze[wallList[randomWall].y ][wallList[randomWall].x]
					partOfMaze[wallList[randomWall].y - 1][wallList[randomWall].x] = 1
					addWalls(maze[wallList[randomWall].y - 1][wallList[randomWall].x])
					removeWall(wallList[randomWall])
				}
				else{
					//if that cell has already been visited don't add any connections, just remove this wall from the list
					removeWall(wallList[randomWall])
				}
			}
			catch(err){
				//if cell is out of bounds do nothing but remove wall from list
				removeWall(wallList[randomWall])
			}
		}

		else if(wallList[randomWall].wall == 'e'){
			//check east
			try{
				if(partOfMaze[wallList[randomWall].y][wallList[randomWall].x + 1] == 0){
					//create a connection if there wasn't one
					maze[wallList[randomWall].y][wallList[randomWall].x].edges.e = maze[wallList[randomWall].y][wallList[randomWall].x + 1]
					maze[wallList[randomWall].y][wallList[randomWall].x + 1].edges.w = maze[wallList[randomWall].y][wallList[randomWall].x]
					partOfMaze[wallList[randomWall].y][wallList[randomWall].x + 1] = 1
					addWalls(maze[wallList[randomWall].y][wallList[randomWall].x + 1])
					removeWall(wallList[randomWall])
				}
				else{
					//if that cell has already been visited don't add any connections, just remove this wall from the list
					removeWall(wallList[randomWall])
				}
			}
			catch(err){
				//if cell is out of bounds do nothing but remove wall from list
				removeWall(wallList[randomWall])
			}
		}

		else if(wallList[randomWall].wall == 's'){
			//check south
			try{		
				if(partOfMaze[wallList[randomWall].y + 1][wallList[randomWall].x] == 0){
					//create a connection if there wasn't one
					maze[wallList[randomWall].y][wallList[randomWall].x].edges.s = maze[wallList[randomWall].y + 1][wallList[randomWall].x]
					maze[wallList[randomWall].y + 1][wallList[randomWall].x].edges.n = maze[wallList[randomWall].y ][wallList[randomWall].x]
					partOfMaze[wallList[randomWall].y + 1][wallList[randomWall].x] = 1
					addWalls(maze[wallList[randomWall].y + 1][wallList[randomWall].x])
					removeWall(wallList[randomWall])
				}
				else{
					//if that cell has already been visited don't add any connections, just remove this wall from the list
					removeWall(wallList[randomWall])
				}
			}
			catch(err){
				//if cell is out of bounds do nothing but remove wall from list
				removeWall(wallList[randomWall])
			}
		}

		else{
			//check west
			try{
				if(partOfMaze[wallList[randomWall].y][wallList[randomWall].x - 1] == 0){
					//create a connection if there wasn't one
					maze[wallList[randomWall].y][wallList[randomWall].x].edges.w = maze[wallList[randomWall].y][wallList[randomWall].x - 1]
					maze[wallList[randomWall].y][wallList[randomWall].x - 1].edges.e = maze[wallList[randomWall].y ][wallList[randomWall].x]
					partOfMaze[wallList[randomWall].y][wallList[randomWall].x - 1] = 1
					addWalls(maze[wallList[randomWall].y][wallList[randomWall].x - 1])
					removeWall(wallList[randomWall])
				}
				else{
					//if that cell has already been visited don't add any connections, just remove this wall from the list
					removeWall(wallList[randomWall])
				}
			}
			catch(err){
				//if cell is out of bounds do nothing but remove wall from list
				removeWall(wallList[randomWall])
			}
		}
	}	
	findShortestPath(0, 0)
	console.log(ShortestPathFromMyLocation)
	
}

createMaze(mazeSize)

function drawCell(cell) {
	if (cell.edges.n === null) {
		context.moveTo(cell.x * (500 / mazeSize), cell.y * (500 / mazeSize));
		context.lineTo((cell.x + 1) * (500 / mazeSize), cell.y * (500 / mazeSize));
		context.stroke();
	}

	if (cell.edges.s === null) {
		context.moveTo(cell.x * (500 / mazeSize), (cell.y + 1) * (500 / mazeSize));
		context.lineTo((cell.x + 1) * (500 / mazeSize), (cell.y + 1) * (500 / mazeSize));
		context.stroke();
	}

	if (cell.edges.e === null) {
		context.moveTo((cell.x + 1) * (500 / mazeSize), cell.y * (500 / mazeSize));
		context.lineTo((cell.x + 1) * (500 / mazeSize), (cell.y + 1) * (500 / mazeSize));
		context.stroke();
	}

	if (cell.edges.w === null) {
		context.moveTo(cell.x * (500 / mazeSize), cell.y * (500 / mazeSize));
		context.lineTo(cell.x * (500 / mazeSize), (cell.y + 1) * (500 / mazeSize));
		context.stroke();
	}
}

function renderCharacter(character) {
	if (character.image.isReady) {
		if(newMaze == true){
			character.location.x = 0
			character.location.y = 0
			newMaze = false
		}
		context.drawImage(character.image,
		character.location.x * (500 / mazeSize), character.location.y * (500 / mazeSize), (500/mazeSize), (500/mazeSize));
	}
}

function drawVisited(cell){
	if (imgCrumb.isReady)
	if (cell.visited){
		context.drawImage(imgCrumb, cell.x * (500 / mazeSize) + ((500/mazeSize)/2) - (100/mazeSize), cell.y * (500 / mazeSize) + ((500/mazeSize)/2) - (100/mazeSize), (200/mazeSize), (200/mazeSize))
	}
}

function drawSP(index){
	context.drawImage(imgHint, ShortestPathFromMyLocation[index].x * (500 / mazeSize), ShortestPathFromMyLocation[index].y * (500 / mazeSize), (500/mazeSize), (500/mazeSize))
}

function moveCharacter(keyCode, character) {
	let shortestPathLength = ShortestPathFromMyLocation.length
	if (keyCode === 40) {
		if (maze[character.location.y][character.location.x].edges.s) {
			character.location = maze[character.location.y][character.location.x].edges.s;
			maze[character.location.y][character.location.x].visited = true

		}
	}
	if (keyCode == 38) {
		if (maze[character.location.y][character.location.x].edges.n) {
			character.location = maze[character.location.y][character.location.x].edges.n;
			maze[character.location.y][character.location.x].visited = true

		}
	}
	if (keyCode == 39) {
		if (maze[character.location.y][character.location.x].edges.e) {
			character.location = maze[character.location.y][character.location.x].edges.e;
			maze[character.location.y][character.location.x].visited = true

		}
	}
	if (keyCode == 37) {
		if (maze[character.location.y][character.location.x].edges.w) {
			character.location = maze[character.location.y][character.location.x].edges.w;
			maze[character.location.y][character.location.x].visited = true

		}
	}
	if (keyCode == 80) {
		if (showSP == false){
			showSP = true
		}
		else{
			showSP = false;
		}
	}

	if (keyCode == 72){
		if (showHint == false){
			showHint = true
		}
		else{
			showHint = false
		}
	}
	findShortestPath(myCharacter.location.y, myCharacter.location.x)
	console.log(shortestPathLength, ShortestPathFromMyLocation.length)
	if (shortestPathLength - ShortestPathFromMyLocation.length >= 1){
		score += 5
	}
	else{
		score -= 3
	}
	document.getElementById("score").innerHTML = score;
	console.log(score)
	mazeRender = true;
}

function renderMaze() {
	context.strokeStyle = 'rgb(0, 0, 0)';
	context.lineWidth = 5;

	for (let row = 0; row < mazeSize; row++) {
		for (let col = 0; col < mazeSize; col++) {
			if(row == mazeSize - 1 && col == mazeSize - 1){
				context.drawImage(imgEnd,
				maze[row][col].x * (500 / mazeSize), maze[row][col].y * (500 / mazeSize),
				500 / mazeSize, 500 / mazeSize);
			}
			else if (imgFloor.isReady) {
				context.drawImage(imgFloor,
				maze[row][col].x * (500 / mazeSize), maze[row][col].y * (500 / mazeSize),
				500 / mazeSize, 500 / mazeSize);
			}
		}
	}
	
	if (showSP == true){
		for (let i = 0; i < ShortestPathFromMyLocation.length; i++) {
			drawSP(i)
		}
	}	

	if(showHint == true){
		try{
			drawSP(ShortestPathFromMyLocation.length - 2)
		}
		catch(err){

		}
	}


	for (let row = 0; row < mazeSize; row++) {
		for (let col = 0; col < mazeSize; col++) {
			drawCell(maze[row][col]);
			drawVisited(maze[row][col]);
		}
	}

	context.beginPath();
	context.moveTo(0, 0);
	context.lineTo(999, 0);
	context.lineTo(999, 999);
	context.lineTo(0, 999);
	context.closePath();
	context.strokeStyle = 'rgb(0, 0, 0)';
	context.stroke();
}

function processInput(elapsedTime) {
	for (input in inputStage) {
		moveCharacter(inputStage[input], myCharacter);
	}
	inputStage = {};
}

function render(elapsedTime) {
	if(mazeRender == true){
		console.log(mazeRender)
		context.clear();
		renderMaze();
		renderCharacter(myCharacter);
	}
	mazeRender = false;
}

function update(elapsedTime) {
	totalTime += elapsedTime
	document.getElementById("time").innerHTML = (totalTime / 1000).toFixed(2);
}

function gameLoop() {
	// let currentTime = performance.now();
	let currentTime = clock(start);
	let elapsedTime = currentTime - previousTime;
	previousTime = currentTime;
	if (myCharacter.location.x == mazeSize-1 && myCharacter.location.y == mazeSize-1){
		alert("You Won! Your Score was: " + score + ", and your time was: " + (totalTime/1000).toFixed(2) + " seconds");
		highScores.push(score)
		var scores = document.getElementById("scores")
		var myScore = document.createElement("li");
		myScore.appendChild(document.createTextNode(score));
		console.log(scores)
		scores.appendChild(myScore)
		changeSize(mazeSize)
	}
	processInput(elapsedTime);
	update(elapsedTime);
	render(elapsedTime);
	requestAnimationFrame(gameLoop);

}

let canvas = null;
let context = null;
var myCharacter = createCharacter('character.png', maze[0][0]);

function initialize() {
	canvas = document.getElementById('canvas-main');
	context = canvas.getContext('2d');

	CanvasRenderingContext2D.prototype.clear = function() {
		this.save();
		this.setTransform(1, 0, 0, 1, 0, 0);
		this.clearRect(0, 0, canvas.width, canvas.height);
		this.restore();
	};

	window.addEventListener('keydown', function(event) {
		//moveCharacter(event.keyCode, myCharacter);
		inputStage[event.keyCode] = event.keyCode;
	});

	requestAnimationFrame(gameLoop);
}