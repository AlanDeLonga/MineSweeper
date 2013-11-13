var bombs = [];
var cells = [];
var selectedCells = [];
var flagged = [];
var height = 8;
var curCheat = 0;
var cheatIdx = 0;
var totalCells = 64;
var gameState = 0;
var flagging = 0;
var curFlag = 0;
var totalBombs = 10;
var load = 0;
var firstClick = 0;
var time=0;
var t;
var timer_is_on=0;

window.onload = initGame();

function initGame() {
	var loading = 0;
	time = 0;
	firstClick = 0;
	timer_is_on=0;
	var url = window.location.href;
	
	if(url.indexOf("?") > 0){
		loading = getValueFromURL("load");
	}
	
	if(loading == 0){
		loadStartContent();
		initArray();
		setBombs();
		setNums();	
	}else{
		load = 1;
		loadGame();
	}		
}

function restart(){
	stopCount();
	reload();
}

function reload(){

	gameState = 0;
	curFlag = 0;
	curCheat = 0;
	time = 0;
	firstClick = 0;
	timer_is_on=0;
	
	var loading = 0;
	var url = window.location.href;
	
	if(url.indexOf("?") > 0){
		loading = getValueFromURL("load");
	}
	
	if(loading==0){
		
		document.getElementById("timer").innerHTML = "Time:  "+time;
		document.getElementById("curFlag").innerHTML = "Flags: "+(totalBombs-curFlag);
		document.getElementById("gameState").src = "img/face.jpg";
		initArray();
		setBombs();
		setNums();

		for(h=0; h <= cells.length; h++ ){
			document.getElementById("cell"+h).src = "img/cell.jpg";
		}	
	}
	else{
		//loadStartContent(); 
		//alert(totalBombs+" "+totalCells+" "+curFlag);
		window.location='index.html?bombs='+totalBombs+'&dim='+height;
	}	
}

// initalize game cells to 0
function initArray() {
	var h;
	cells = new Array();
	flagged = new Array();
	bombs = new Array();
	
	
	for(h=0; h < totalCells; h++ ){
		cells[h] = 0;
	}
	for(h=0; h < totalBombs; h++ ){
		flagged[h] = -1;
	}	
	for(h=0; h < totalBombs; h++ ){
		bombs[h] = 0;
	}
	selectedCells = new Array();

}

function loadStartContent(){

	// First, we load the URL into a variable
	var url = window.location.href;
	
	if(url.indexOf("?") > 0){	
		load = 0;
		// set up initial content for page
		totalBombs = parseInt(getValueFromURL("bombs"), 10);
		height = parseInt(getValueFromURL("dim"), 10);	
	}
	else{
		totalBombs = 10;
		height =8;
	}
	totalCells = height*height;

}

function loadGame(){

	selectedCells = new Array();
	var select = cookieVal("select").split(',');
	var flag = cookieVal("flag").split(',');
	var bomb = cookieVal("bomb").split(',');
	var cell =  cookieVal("cell").split(',');	
	
	loadArrays(select, flag, bomb, cell);
	
	height = cookieVal("height");
	curCheat = cookieVal("curCheat");
	cheatIdx = cookieVal("cheatIdx");
	totalCells = cookieVal("totalCells");
	gameState = cookieVal("gameState");
	flagging = cookieVal("flagging");
	curFlag = cookieVal("curFlag");
	totalBombs = cookieVal("totalBombs");	
}

function loadArrays(select, flag, bomb, cell){
	var h;

	for(h=0; h < select.length; h++ ){
		selectedCells[h] = parseInt(select[h], 10);
	}
	
	for(h=0; h < flag.length; h++ ){
		flagged[h] = parseInt(flag[h], 10);
	}	

	for(h=0; h < bomb.length; h++ ){
		bombs[h] = parseInt(bomb[h], 10);
	}
	
	for(h=0; h < cell.length; h++ ){
	    if(cell[h]=='b'){cells[h] = cell[h];}
		else{cells[h] = parseInt(cell[h], 10);}
	}	
}

function switchImg(idx) {

	var id = "cell"+idx;
	var src = "img/"+cells[idx]+".jpg";
	
	if(firstClick == 0){
		doTimer();
		firstClick++;
	}
	
	if(gameState == 0){
		// check to see if flagging is off
		if(!flagging){
			// add the index to the selected Cells for game status checks
			if(selectedCells.indexOf(idx) == -1){
				selectedCells.push(idx);
			}
			// if you selected a bomb change game state and display message
			if(cells[idx] == 'b' ){
				var i;
				document.getElementById(id).src = src;
				gameState = 1;
				for(i=0; i<cells.length; i++){
					if(cells[i] == 'b' ){
						document.getElementById("cell"+i).src = "img/b.jpg";
					}
				}
				document.getElementById("gameState").src = "img/die.jpg";
				
				stopCount();
				alert("Oh no!... you died");
			}
			else{
				// check to see if tile is flagged
				var oldFlag = flagged.indexOf(idx);
				
				// if it is flagged free its spot in the array
				if(oldFlag != -1){ 
					flagged[oldFlag] = -1; 
					curFlag--;
					updateFlags();
				}					
				
				document.getElementById(id).src = src;
				
				if(cells[idx] == 0){
					document.getElementById(id).src = "img/0.jpg";
					cascadeOpen(idx);
				}
				
				if(selectedCells.length == (cells.length - bombs.length)){
					var i;
					for(i=0; i<bombs.length; i++){
						document.getElementById("cell"+bombs[i]).src = "img/flag.jpg";
					}
					gameState = 2;
					
					alert("Congradulations! You won in "+(time-1)+" seconds!");
					stopCount();
				}
			}			
		}
		// if flagging is enabled and you have more available flags
		// find an open index, increment flag counter and change tile image
		else if(curFlag < bombs.length && (selectedCells.indexOf(idx)==-1)){
			var newFlag = flagged.indexOf(-1);
			var flagsLeft = totalBombs - curFlag;
			curFlag++;
			flagged[newFlag] = idx;
			updateFlags();
			document.getElementById(id).src = "img/flag.jpg";
		}
	}
	return false;
}

// randomly set bombs up into the grid/array
function setBombs() {
	var j;
	for(j=0; j < totalBombs; j++ ){
		randIdx = Math.floor(Math.random()*totalCells);
		
		if(cells[randIdx] == 'b'){ --j; }
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
	for(i = 0; i < cells.length; i++ ){
		var topLeft = 0;
		var topRight = height-1;
		var bottomLeft = totalCells-(height);
		var bottomRight = totalCells-1;
		
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
			else if(i>0 && i<height){
				var testArray = [(i-1), (i+1), (i+height-1), (i+height), (i+height+1)];
				cells[i] = bombCounter(testArray);	
			}// bottom row	
			else if(i>(cells.length-height) && i<cells.length){
				var testArray = [(i-1), (i+1), (i-height-1), (i-height), (i-height+1)];
				cells[i] = bombCounter(testArray);	
			}// left row
			else if(i%height == 0){
				var testArray = [(i-height+1), (i-height), (i+1), (i+height+1), (i+height)];
				cells[i] = bombCounter(testArray);	
			}// right row
			else if((i+1)%height == 0){
				var testArray = [(i-height), (i-height-1), (i-1), (i+height), (i+height+-1)];
				cells[i] = bombCounter(testArray);	
			}// middle cells
			else{
				var testArray = [(i-height+1), (i-height), (i-height-1), (i-1), (i+1), (i+height-1), (i+height), (i+height+1)];
				cells[i] = bombCounter(testArray);		
			}			
		}
	}
}

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j, 1);
        }
    }

    return a;
};

// creates an array containing all empty cells touching the
// cells indexed in the testArray
function emptyCellList(testArray) {
	var emptyList = [];
	var nextCell = 0;
	var k;
	for(k=0; k < testArray.length; k++ ){
		if(cells[testArray[k]] == 0){ 
			emptyList[nextCell] = testArray[k];
			nextCell++;
		}
	}
	return emptyList;
}

// creates an array containing all empty cells touching the
// cells indexed in the testArray
function numCellList(testArray) {
	var numList = [];
	var nextCell = 0;
	var k;
	for(k=0; k < testArray.length; k++ ){
		if(cells[testArray[k]] != 'b' && cells[testArray[k]] != 0){ 
			numList[nextCell] = testArray[k];
			nextCell++;
		}
	}
	return numList;
}

// Cascade open
function cascadeOpen(idx) {
	var i;
	var id;
	var done = 0;
	var paths = 0;
	var emptyCells = [idx];
	var numberCells = [];
	var checkedCells = [];
	var topLeft = 0;
	var topRight = height-1;
	var bottomLeft = totalCells-(height);
	var bottomRight = totalCells-1;
		
	while(emptyCells.length > 0 && done == 0){
		
		while((checkedCells.indexOf(i)!= -1) && emptyCells.length > 0){
			i = emptyCells.pop();
		}		
		checkedCells.push(i);

	
		// left top corner
		if(i == topLeft){
			var testArray = [(i+1), (i+height), (i+height+1)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();
			numberCells = numberCells.concat(numCellList(testArray)).unique();
		}// right top corner
		else if(i == topRight){
			var testArray = [(i-1), (i+height-1), (i+height)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();	
			numberCells = numberCells.concat(numCellList(testArray)).unique();
		}// left bottom corner	
		else if(i == bottomLeft){
			var testArray = [(i-height+1), (i-height), (i+1)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();
			numberCells = numberCells.concat(numCellList(testArray)).unique();			
		}// right bottom corner	
		else if(i == bottomRight){
			var testArray = [(i-1), (i-height), (i-height-1)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();
			numberCells = numberCells.concat(numCellList(testArray)).unique();
		}// top row
		else if(i>0 && i<height){
			var testArray = [(i-1), (i+1), (i+height-1), (i+height), (i+height+1)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();	
			numberCells = numberCells.concat(numCellList(testArray)).unique();
		}// bottom row	
		else if(i>(cells.length-height) && i<cells.length){
			var testArray = [(i-1), (i+1), (i-height-1), (i-height), (i-height+1)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();	
			numberCells = numberCells.concat(numCellList(testArray)).unique();
		}// left row
		else if(i%height == 0){
			var testArray = [(i-height+1), (i-height), (i+1), (i+height+1), (i+height)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();	
			numberCells = numberCells.concat(numCellList(testArray)).unique();
		}// right row
		else if((i+1)%height == 0){
			var testArray = [(i-height), (i-height-1), (i-1), (i+height), (i+height+-1)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();	
			numberCells = numberCells.concat(numCellList(testArray)).unique();
		}// middle cells
		else{
			var testArray = [(i-height+1), (i-height), (i-height-1), (i-1), (i+1), (i+height-1), (i+height), (i+height+1)];
			emptyCells = emptyCells.concat(emptyCellList(testArray)).unique();		
			numberCells = numberCells.concat(numCellList(testArray)).unique();
		}		
		
		//curCount = emptyCells.length;
		//alert(checkedCells.join(','));
		if(checkedCells.length > 3 && checkedCells[checkedCells.length-1] == checkedCells[checkedCells.length-3]){done = 1;}

	}
	// check to see if tile is flagged
	var oldFlag;
								

	for(i=1; i < checkedCells.length; i++){
		if(typeof checkedCells[i] === "undefined"){}
		else{			
			id = "cell"+checkedCells[i];
			document.getElementById(id).src = "img/0.jpg";
			
			oldFlag = flagged.indexOf(checkedCells[i]);
			
			// if it is flagged free its spot in the array
			if(oldFlag != -1){ 
				flagged[oldFlag] = -1; 
				curFlag--;
				updateFlags();
			}

			// add the index to the selected Cells for game status checks
			if(selectedCells.indexOf(checkedCells[i]) == -1){
				selectedCells.push(checkedCells[i]);
			}
		}
	}
	
	for(i=0; i < numberCells.length; i++){
		
		if(typeof cells[numberCells[i]] === "NaN" || typeof cells[numberCells[i]] === "undefined"){}
		else{			
			id = "cell"+numberCells[i];
			
			document.getElementById(id).src = "img/"+cells[numberCells[i]]+".jpg";
			
			oldFlag = flagged.indexOf(numberCells[i]);
			
			// if it is flagged free its spot in the array
			if(oldFlag != -1){ 
				flagged[oldFlag] = -1; 
				curFlag--;
				updateFlags();
			}

			// add the index to the selected Cells for game status checks
			if(selectedCells.indexOf(numberCells[i]) == -1){
				selectedCells.push(numberCells[i]);
			}
		}
	}
}

// checks to see if the player has won
function checkBoard(){
	var t;
	var die = 0;
	
	for(t=0; t<bombs.length; t++){
		if(bombs.indexOf(flagged[t]) == -1){
			die = 1;
		}	
	}
	if(gameState == 0){
		if(((selectedCells.length == (totalCells-bombs.length)) && gameState != 1) || !die){
			gameState = 2;
			if(curCheat == 0){
				stopCount();
				alert("Congradulations! You won in "+(time-1)+" seconds!");
			}else{
				stopCount();
				alert("Congradulations! You won in "+(time-1)+" seconds... but you cheated "+curCheat+" times");
			}
		}
		else{
			gameState = 1;
			document.getElementById("gameState").src = "img/die.jpg";
			alert("Oops! You didn't flag the right tiles :X");
			stopCount();
		}
	}
	else{
		restart();
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

	if(firstClick == 0){
		doTimer();
		firstClick++;
	}
	
	if(curFlag >= bombs.length){
		if(cheatIdx == bombs.length){
			alert("You have already flagged all the mines");
		}else{
			alert("You ran out of flags, you must select a tile with a flag before you can cheat");
		}
	}else{
		if(cheatIdx <= bombs.length){
			var id = "cell"+bombs[cheatIdx];
			var newFlag = flagged.indexOf(-1);
			
			while(flagged.indexOf(bombs[cheatIdx])!= -1){
				cheatIdx++;
			}
			
			flagged[newFlag] = bombs[cheatIdx];
			curFlag++;
			updateFlags();
			
			document.getElementById(id).src = "img/flag.jpg";
			
			curCheat++;	
			cheatIdx++;
		}		
	}
}

function updateFlags(){
	document.getElementById("curFlag").innerHTML = "Flags: "+(totalBombs-curFlag);
}

function getValueFromURL(varname){

	// First, we load the URL into a variable
	var url = window.location.href;

	// Next, split the url by the ?
	var qparts = url.split("?");

	// Check that there is a querystring, return "" if not
	if (qparts.length == 0)
	{
		return "";
	}
	
	// Then find the querystring, everything after the ?
	var query = qparts[1];
	
	// Split the query string into variables (separates by &s)
	var vars = query.split("&");

	// Initialize the value with "" as default
	var value = "";

	// Iterate through vars, checking each one for varname
	for (i=0;i<vars.length;i++)
	{
		// Split the variable by =, which splits name and value
		var parts = vars[i].split("=");
    
		// Check if the correct variable
		if (parts[0] == varname)
		{
			// Load value into variable
			value = parts[1];

			// End the loop
			break;
		}
	}
  
	// Convert escape code
	value = unescape(value);

	// Convert "+"s to " "s
	value.replace(/\+/g," ");

	// Return the value
	return value;
}

function saveGame() {
	// sets up exp date
	var expireDate = new Date();
	expireDate.setMonth(expireDate.getMonth()+6);
	
	var select = selectedCells.join(',');
	var flag = flagged.join(',');
	var bomb = bombs.join(',');
	var cell = cells.join(',');

	// writing cookies
	document.cookie = "select=" + select + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "flag=" + flag + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "bomb=" + bomb + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "cell=" + cell + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "height=" + height + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "totalCells=" + totalCells + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "gameState=" + gameState + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "curFlag=" + curFlag + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "curCheat=" + curCheat + ";path=/;expires=" + expireDate.toGMTString();
	document.cookie = "totalBombs=" + totalBombs + ";path=/;expires=" + expireDate.toGMTString();
}

// finds value associated with cookie name
function cookieVal(cookieName) {
	var thisCookie = document.cookie.split("; ");

	for (var i=0; i<thisCookie.length; i++) {
		if (cookieName == thisCookie[i].split("=")[0]) {
			return thisCookie[i].split("=")[1];
		}
	}
	return 0;
}

function timedCount(){
	document.getElementById("timer").innerHTML = "Time:  "+time;
	time=time+1;
	t=setTimeout("timedCount()",1000);
}

function doTimer(){
	if (!timer_is_on)
	{
		timer_is_on=1;
		timedCount();
	}
}

function stopCount(){
	clearTimeout(t);
	timer_is_on=0;
}