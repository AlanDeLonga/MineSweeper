var bombs = [];
var cells = new Array(65);
var selectedCells = [];
var height = 8;
var curCheat = 0;
var totalCells = height*height;
var gameState;
var flagging = 0;
var curFlag = 0;
var totalBombs = 10;
var flagged = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

window.onload = initAll();

function initAll() {

	gameState = 0;
	initArray();
	setBombs();
	setNums();
		
}

function switchImg(idx) {

	//alert(idx);
	var id = "cell"+idx;
	var src = cells[idx]+".jpg";
	
	// check to see if flagging is off
	if(!flagging){
		// add the index to the selected Cells for game status checks
		if(selectedCells.indexOf(idx) == -1){
			selectedCells.push(idx);
		}
		// if you selected a bomb shange game state and display message
		if(cells[idx] == 'b' ){
			document.getElementById(id).src = src;
			gameState = 1;
			document.getElementById("gameState").src = "die.jpg";
			alert("Oh no!... you died");
		}
		else if(cells[idx] > 0 && cells[idx] < 9){
			// check to see if tile is flagged
			var oldFlag = flagged.indexOf(idx);
			
			// if it is flagged free its spot in the array
			if(oldFlag != -1){ 
				flagged[oldFlag] = 0; 
				curFlag--;
			}			
			
			document.getElementById(id).src = src;
		}
		else{
			// check to see if tile is flagged
			var oldFlag = flagged.indexOf(idx);
			// if it is flagged free its spot in the array
			if(oldFlag != -1){ 
				flagged[oldFlag] = 0;
				curFlag--;
			}
			document.getElementById(id).src = "0.jpg";
		}
	}
	// if flagging is enabled and you have more available flags
	// find an open index, increment flag counter and change tile image
	else if(curFlag < bombs.length && (selectedCells.indexOf(idx)==-1)){
		var newFlag = flagged.indexOf(0);
		curFlag++;
		flagged[newFlag] = idx;
		document.getElementById(id).src = "flag.jpg";
	}
	return false;
}

// randomly set bombs up into the grid/array
function setBombs() {
	var j;
	for(j=0; j < totalBombs; j++ ){
		randIdx = Math.floor(Math.random()*cells.length);
		
		if(cells[randIdx] == 'b' || randIdx == 0){ --j; }
		else{ 
			cells[randIdx] = 'b';
			bombs[j] =randIdx;
		}
	}
}

// counts the number of bombs at the indecies in the array that is passed in
function bombCounter(testArray) {
	var count = 0;
	var k;
	for(k=0; k < testArray.length; k++ ){
		if(bombs.indexOf(testArray[k]) != -1){ count++;}
	}
	return count;
}

// Sets the number for tiles near bombs
function setNums() {
	var i;
	for(i = 1; i < cells.length; i++ ){
		var topLeft = 1;
		var topRight = height;
		var bottomLeft = totalCells-(height-1);
		var bottomRight = totalCells;
		
		if(cells[i] != 'b'){
			// left top corner
			if(i == topLeft){
				var testArray = [(i+1), (i+height), (i+height+1)];
				cells[i] = bombCounter(testArray);					
			}// right top corner
			else if(i == topRight){
				var testArray = [(i-1), (i+height-1), (i+height)];
				cells[i] = bombCounter(testArray);	
			}// left bottom corner	
			else if(i == bottomLeft){
				var testArray = [(i-height+1), (i-height), (i+1)];
				cells[i] = bombCounter(testArray);	
			}// right bottom corner	
			else if(i == bottomRight){
				var testArray = [(i-1), (i-height), (i-height-1)];
				cells[i] = bombCounter(testArray);	
			}// top row
			else if(i>1 && i<(height+1)){
				var testArray = [(i-1), (i+1), (i+height-1), (i+height), (i+height+1)];
				cells[i] = bombCounter(testArray);	
			}// bottom row	
			else if(i>(cells.length-height) && i<cells.length){
				var testArray = [(i-1), (i+1), (i-height-1), (i-height), (i-height+1)];
				cells[i] = bombCounter(testArray);	
			}// right row
			else if(i%height == 0){
				var testArray = [(i-height-1), (i-height), (i-1), (i+height-1), (i+height)];
				cells[i] = bombCounter(testArray);	
			}// left row
			else if((i-1)%height == 0){
				var testArray = [(i-height), (i-height+1), (i+1), (i+height), (i+height+1)];
				cells[i] = bombCounter(testArray);	
			}// middle cells
			else{
				var testArray = [(i-height+1), (i-height), (i-height-1), (i-1), (i+1), (i+height-1), (i+height), (i+height+1)];
				cells[i] = bombCounter(testArray);		
			}			
		}
	}
}

// checks to see if the player has won
function checkBoard(){
	//alert("selected: "+selectedCells.length+" bombs: "+bombs.length+" totalCells "+totalCells);
	var t;
	var die = 0;
	
	for(t=0; t<bombs.length; t++){
		if(bombs.indexOf(flagged[t]) == -1){
			die = 1;
		}	
	}
	if(gameState != 1){
		if(((selectedCells.length == (totalCells-bombs.length)) && gameState != 1) || !die){
			gameState = 2;
			if(curCheat == 0){
				alert("Congradulations! You won!");
			}else{
				alert("Congradulations! You won... but you cheated "+curCheat+" times");
			}
		}
		else{
			gameState = 1;
			document.getElementById("gameState").src = "die.jpg";
			alert("Oops! You didn't flag the right tiles :X");
		}
	}
}

function flagTile(){
	if(curFlag < bombs.length){
		flagging++;
	
		flagging = flagging%2;
	}else{
		flagging = 0;
	}
}

// Flags a mine that has not been flagged by this method
function flagMine(){

	flagging = 0;

	if(curFlag >= bombs.length){
		if(curCheat == bombs.length){
			alert("You have already flagged all the mines");
		}else{
			alert("You ran out of flags, you must select a tile with a flag before you can cheat");
		}
	}else{
		if(curCheat <= bombs.length){
			var id = "cell"+bombs[curCheat];
			var newFlag = flagged.indexOf(0);
			
			flagged[newFlag] = bombs[curCheat];
			curFlag++;
			
			document.getElementById(id).src = "flag.jpg";
		}
		
		curCheat++;	
	}
}


// initalize game cells to 0
function initArray() {
	var h;
	for(h=0; h < cells.length; h++ ){
		cells[h] = 0;
	}
}
