/*
  This function will be calling the GameBox.CreateGameBox()
  function and then will emit the drawing function to the client 
  side.
  @author : Navjot Singh Dhaliwal
*/
var Constants = require('./Constants.js');
var ClusterFunction = require('./GameClass.js');

function SocketEvents(ioObject,GameBox,gameInformation){
  ioObject.sockets.on('connection', function (socket){
    var clicked = false;
    var clickedElement = null;
    var potentialSwappingCandidate = null;
      GameBox.CreateGameBox(function(arrayArg){
        socket.emit("Game Initialized",{array : arrayArg});
        socket.on("ClickedOnCanvas",function (data) {
          //If user clicked on the canvas and the game is not over yet..
          if(clicked && !(arrayArg[Constants().LEVEL_INFORMATION].gameOver)){
            var destinationId = parseInt(WhichElementWasClicked(data.X,data.Y));//this element is destination where we want move our element.
            validSwap(clickedElement,destinationId,arrayArg,function(modifiedGameArray){//Pass the data to the callback function
              //If the elements is valid manipulate the array and pass the necessary information for animation of swapping functions
              MoveIsValid(modifiedGameArray,socket,{dest : destinationId,home : clickedElement,destElement : arrayArg[parseInt(destinationId)].element,homeElement : arrayArg[parseInt(clickedElement)].element});
            });
            socket.emit("Dehighlight",{id : clickedElement,element : arrayArg[parseInt(clickedElement)].element});
            clicked = false;
          }
          //Else switch the clicked variable for potential swapping..
          else if(clicked == false && !(arrayArg[Constants().LEVEL_INFORMATION].gameOver)){
            clicked = true;
            clickedElement = WhichElementWasClicked(data.X,data.Y);//We cant parse the home element because we have implementation for string
            socket.emit("Highlight",{id : clickedElement,element : arrayArg[parseInt(clickedElement)].element});
          }//We have to check if an element has been clicked..
        });
      }
    ,gameInformation);
  });
}
/*
  This function would be invoked after checking if the move
  is valid. 
  @param modifiedGameArray : Newest version of the game array
  @param socket : Socket to pass the data
  @param ids : ids of the elements to swap
*/
function MoveIsValid(modifiedGameArray,socket,ids){
  modifiedGameArray[Constants().LEVEL_INFORMATION].moves--;
  socket.emit("SwapAnimation",{ids : ids});
  //Give some time for swaping animation
  setTimeout(function(){
    socket.emit("Redraw",{array : modifiedGameArray});
    //After swaping check for the clusters in the game array
    ClusterFunction.FindClustersHandler(modifiedGameArray,function(clusterArray,array){
      //We use this function inside the callback to pass data to this function
    ClusterFunction.PopElements(clusterArray,array,socket);
    });
  }
  ,120);//Give some time to animation then redraw the whole game.
}

/*
  This function would determine which element was clicked on the client side.
  @param xMouse : X coordinate of the mouse click on the client side.
  @param yMouse : Y coordinate of the mouse click on the client side.
*/
function WhichElementWasClicked(xMouse,yMouse){
  if(yMouse > Constants().HEIGHT_OF_CANVAS || xMouse > Constants().WIDTH_OF_CANVAS){
  	throw new Error("Invalid Coords");
  }
	var xCoord = 0;
  var yCoord = 0;
  for(var i = 0; i <= Constants().TOTAL_BOXES_HORIZONTALLY_AND_VERTICALLY; i++){
  	if(xMouse < (Constants().LENGTH_OF_ONE_BOX*i)){
    	xCoord = i;
      break;
    }
  }
  for(var k = 0; k <= Constants().TOTAL_BOXES_HORIZONTALLY_AND_VERTICALLY; k++){
  	if(yMouse < (Constants().HEIGHT_OF_ONE_BOX*k)){
    	yCoord = k;
      break;
    }
  }
  return ""+yCoord+xCoord;
}
//This function checks if we have a valid swap. we will have two elements and
//then we will check if we have a valid swap with those elements.
function validSwap(movingElement,destinationId,gameArray,callback){
  DetermineThePositionOfClickedElement(movingElement,destinationId,gameArray,callback);
}//End validSwap

//This is helper method for validSwap function which will determine the position
//of the clicked element and then pass it to the validSwap function.
function DetermineThePositionOfClickedElement(id,destinationId,gameArray,callback){
  var possibleMovement;
  if(checkIfElementCanHaveAllLegalMoves(id)){
    possibleMovement = Constants().ALL_LEGAL;
  }
  else if(ifElementIsInTheLastRowOnly(id)){
    possibleMovement = Constants().BOTTOM_ROW;
  }
  else if(ifElementIsInTheFirstRowOnly(id)){
    possibleMovement = Constants().UPPER_ROW;
  }
  else if(ifElementIsInFirstRowAndLastColumn(id)){
    possibleMovement = Constants().RIGHT_EDGE;
  }
  else if(ifElementIsInFirstRowAndFirstColumn(id)){
    possibleMovement = Constants().LEFT_EDGE;
  }
  else if(ifElementIsInTheLastRowAndLastColumn(id)){
    possibleMovement = Constants().BOTTOM_RIGHT_EDGE;
  }
  else if(ifElementIsInTheLastRowAndFirstColumn(id)){
    possibleMovement = Constants().BOTTOM_LEFT_EDGE;
  }
  else if(ifElementIsInLastColumnOnly(id)){
    possibleMovement = Constants().RIGHT_COLUMN;
  }
  else if(ifElementIsInFirstColumnOnly(id)){
    possibleMovement = Constants().LEFT_COLUMN;
  }
  else {
    throw new "Invalid ID or garbage data passed.";
  }
  AssignPositions(callback,id,possibleMovement,gameArray,destinationId);
  return possibleMovement;//for testing purposes
}

//Helper method of DetermineThePositionOfClickedElement function in which we pass
//category of the element and then assign the legal swaps and than call the callback
//function.
function AssignPositions(callback,currentPosition,positionCategory,gameArray,destinationId){
  var locations = {LE:"",RE:"",BRE:"",BLE:"",LC:"",RC:"",UR:"",BR:"",AL:""};
  currentPosition = parseInt(currentPosition);//we need to parse as we need the string form for our other funcitons
  locations.LE = [currentPosition+10,currentPosition+1];
  locations.RE = [currentPosition+10,currentPosition-1];
  locations.BRE = [currentPosition-10,currentPosition-1];
  locations.BLE = [currentPosition-10,currentPosition+1];
  locations.LC = [currentPosition-10,currentPosition+10,currentPosition+1];
  locations.RC = [currentPosition-10,currentPosition+10,currentPosition-1];
  locations.UR = [currentPosition+10,currentPosition-1,currentPosition+1];
  locations.BR = [currentPosition-10,currentPosition+1,currentPosition-1];
  locations.AL = [currentPosition+10,currentPosition-10,currentPosition+1,currentPosition-1];
  var validMovements = [];
  //if both elements are same there is no need to swap the elements.
  if(gameArray[currentPosition].element !== gameArray[destinationId].element){
    validMovements = locations[positionCategory];
  }
  DetectCombination(currentPosition,destinationId,gameArray,callback);
  return locations[positionCategory];//for testing purposes
}
//This helper method will check if by moving certain elements we can have
//a combination of particular elements
function DetectCombination(currentPosition,destinationId,gameArray,callback){
  var movementPossible = false;
  var possibleCombinations = [];
  var legalCombinations = [];

  //This code need to be refactored as we have these two if statments which make
  //code looks messy.

  if((destinationId - currentPosition) === -10){//if we are moving element up..
    //this all are combinations we need to check..
    possibleCombinations.push([destinationId-20,destinationId-10,currentPosition]);
    possibleCombinations.push([destinationId-2,destinationId-1,currentPosition]);
    possibleCombinations.push([destinationId-1,currentPosition,destinationId+1]);
    possibleCombinations.push([currentPosition,destinationId+1,destinationId+2]);
  }
  else if((destinationId - currentPosition) === 10){//if we are moving element down..
    //all combinations needed to be checked if we are moving element down..
    possibleCombinations.push([destinationId+20,destinationId+10,currentPosition]);
    possibleCombinations.push([destinationId-2,destinationId-1,currentPosition]);
    possibleCombinations.push([destinationId-1,currentPosition,destinationId+1]);
    possibleCombinations.push([currentPosition,destinationId+1,destinationId+2]);
  }
  else if((destinationId - currentPosition) === 1){//if we are moving element towards right..
    possibleCombinations.push([destinationId+20,destinationId+10,currentPosition]);
    possibleCombinations.push([destinationId+2,destinationId+1,currentPosition]);
    possibleCombinations.push([destinationId-20,destinationId-10,currentPosition]);
    possibleCombinations.push([destinationId-10,currentPosition,destinationId+10]);
  }
  else if((destinationId - currentPosition) === -1){//if we are moving element towards left..
    possibleCombinations.push([destinationId+20,destinationId+10,currentPosition]);
    possibleCombinations.push([destinationId-2,destinationId-1,currentPosition]);
    possibleCombinations.push([destinationId-20,destinationId-10,currentPosition]);
    possibleCombinations.push([destinationId-10,currentPosition,destinationId+10]);
  }

  //This other if statement is to swap the destination and current element.
  if((currentPosition - destinationId) === -10){//if we are moving element up..
    //this all are combinations we need to check..
    possibleCombinations.push([currentPosition-20,currentPosition-10,destinationId]);
    possibleCombinations.push([currentPosition-2,currentPosition-1,destinationId]);
    possibleCombinations.push([currentPosition-1,destinationId,currentPosition+1]);
    possibleCombinations.push([destinationId,currentPosition+1,currentPosition+2]);
  }
  else if((currentPosition - destinationId) === 10){//if we are moving element down..
    //all combinations needed to be checked if we are moving element down..
    possibleCombinations.push([currentPosition+20,currentPosition+10,destinationId]);
    possibleCombinations.push([currentPosition-2,currentPosition-1,destinationId]);
    possibleCombinations.push([currentPosition-1,destinationId,currentPosition+1]);
    possibleCombinations.push([destinationId,currentPosition+1,currentPosition+2]);
  }
  else if((currentPosition - destinationId) === 1){//if we are moving element towards right..
    possibleCombinations.push([currentPosition+20,currentPosition+10,destinationId]);
    possibleCombinations.push([currentPosition+2,currentPosition+1,destinationId]);
    possibleCombinations.push([currentPosition-20,currentPosition-10,destinationId]);
    possibleCombinations.push([currentPosition-10,destinationId,currentPosition+10]);
  }
  else if((currentPosition - destinationId) === -1){//if we are moving element towards left..
    possibleCombinations.push([currentPosition+20,currentPosition+10,destinationId]);
    possibleCombinations.push([currentPosition-2,currentPosition-1,destinationId]);
    possibleCombinations.push([currentPosition-20,currentPosition-10,destinationId]);
    possibleCombinations.push([currentPosition-10,destinationId,currentPosition+10]);
  }

  //here we check if possible combinations are legal and push them into the legal array..
  for(var i = 0;i<possibleCombinations.length;i++){
    if(!InvalidIdArray(possibleCombinations[i])){
      legalCombinations.push(possibleCombinations[i]);
    }
  }
  //Here we check if the elements are same at those combinations and can be moved..
  for(var j = 0;j<legalCombinations.length;j++){
    if(SameTokens(gameArray,legalCombinations[j])){
      movementPossible = true;
      //Here we have to record all the combinaitons that are legal
      //we have to record all those combinations into an array and
      //than we have to iterate that array and pop that elements and
      //recreate the array and than we have to serve that array to the
      //Sockets and redraw the game canvas..
      break;
    }
  }
  //if movement is possible then iterate through the legal array and execute all the combinations
  if(movementPossible){
    var destinationElement = gameArray[destinationId].element;
    var currentElement = gameArray[currentPosition].element;
    gameArray[currentPosition].element = destinationElement;
    gameArray[destinationId].element = currentElement;
    //In the callback function we can pass the modified array..
    callback(gameArray);
  }
}
//Helper method to determine if the tokens are same in a given array
function SameTokens(gameArray,combinationArray){
  if((gameArray[combinationArray[0]].element === gameArray[combinationArray[1]].element) && (gameArray[combinationArray[1]].element === gameArray[combinationArray[2]].element)){
    return true;
  }
  return false;
}
//Helper method to determine if an ID is invalid
function InvalidIdArray(idArray){
  var invalidId = false;
  for(var i = 0; i < idArray.length;i++){
    if(idArray[i] < 11 || idArray>88){
      invalidId = true;
      return invalidId;
    }
    var xAndYCoords = breakIdIntoCoordinates(""+idArray[i]);//Comvert to string
    //Now we need to convert both values to the integer form..
    xAndYCoords.coordX = parseInt(xAndYCoords.coordX);
    xAndYCoords.coordY = parseInt(xAndYCoords.coordY);
    invalidId = (xAndYCoords.coordX < 1) || (xAndYCoords.coordX > 8) || (xAndYCoords.coordY < 1) || (xAndYCoords.coordY > 8);
    if(invalidId){return invalidId;}//if we find that one of the id is invalid return immediately..
  }
  return invalidId;
}

//Helper method to check if the element is in the position where all legal movements are possible
function checkIfElementCanHaveAllLegalMoves(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifTrue = checkIfElementIsInFirstRow(xAndYCoords.coordY) || checkIfTheElementIsInLastRow(xAndYCoords.coordY) || checkIfTheElementIsInLastColumn(xAndYCoords.coordX) || checkIfTheElementIsInTheFirstColumn(xAndYCoords.coordX);
  if(ifTrue){
    return false;
  }
  return true;
}

//Check if the element is in the first row only and not in last or first column
function ifElementIsInTheFirstRowOnly(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifInFirstRow = checkIfElementIsInFirstRow(xAndYCoords.coordY);
  if(ifInFirstRow){
    var checkIfInLastOrFirstColumn = checkIfTheElementIsInLastColumn(xAndYCoords.coordX) || checkIfTheElementIsInTheFirstColumn(xAndYCoords.coordX);
    if(checkIfInLastOrFirstColumn){
      return false;
    }
    return true;
  }
  return false;
}

//Helper method element is in the last row..
function ifElementIsInTheLastRowOnly(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifInLastRow = checkIfTheElementIsInLastRow(xAndYCoords.coordY);
  if(ifInLastRow){
    var checkIfInLastOrFirstColumn = checkIfTheElementIsInLastColumn(xAndYCoords.coordX) || checkIfTheElementIsInTheFirstColumn(xAndYCoords.coordX);
    if(checkIfInLastOrFirstColumn){
      return false;
    }
    return true;
  }
  return false;
}

//Helper method to check if the element is in the last column and first row
function ifElementIsInFirstRowAndLastColumn(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifInFirstRowAndLastColumn = checkIfElementIsInFirstRow(xAndYCoords.coordY) && checkIfTheElementIsInLastColumn(xAndYCoords.coordX);
  return ifInFirstRowAndLastColumn;
}
//Helper method to check if the element is in the first row and first column
function ifElementIsInFirstRowAndFirstColumn(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifInFirstRowAndFirstColumn = checkIfElementIsInFirstRow(xAndYCoords.coordY) && checkIfTheElementIsInTheFirstColumn(xAndYCoords.coordX);
  return ifInFirstRowAndFirstColumn;
}
//Helper method to check if the element is in the last column and last row
function ifElementIsInTheLastRowAndLastColumn(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifInLastRowAndLastColumn = checkIfTheElementIsInLastRow(xAndYCoords.coordY) && checkIfTheElementIsInLastColumn(xAndYCoords.coordX);
  return ifInLastRowAndLastColumn;
}
//Helper method to check if the element is in last row and first column
function ifElementIsInTheLastRowAndFirstColumn(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifInLastRowAndFirstColumn = checkIfTheElementIsInLastRow(xAndYCoords.coordY) && checkIfTheElementIsInTheFirstColumn(xAndYCoords.coordX);
  return ifInLastRowAndFirstColumn;
}

//Helper method to check if the element is in the last column only and not in the first or last row
function ifElementIsInLastColumnOnly(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifInLastColumn = checkIfTheElementIsInLastColumn(xAndYCoords.coordX);
  if(ifInLastColumn){
    var ifInLastOrFirstColumn = checkIfElementIsInFirstRow(xAndYCoords.coordY) || checkIfTheElementIsInLastRow(xAndYCoords.coordY);
    if(ifInLastOrFirstColumn){
      return false;
    }
    return true;
  }
  return false;
}

//Helper method to check if the element is in the first column only and not in the first or last row.
function ifElementIsInFirstColumnOnly(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifInFirstColumn = checkIfTheElementIsInTheFirstColumn(xAndYCoords.coordX);
  if(ifInFirstColumn){
    var ifInLastOrFirstColumn = checkIfElementIsInFirstRow(xAndYCoords.coordY) || checkIfTheElementIsInLastRow(xAndYCoords.coordY);
    if(ifInLastOrFirstColumn){
      return false;
    }
    return true;
  }
  return false;
}

//Helper method to check if the element we have is in first row.
function checkIfElementIsInFirstRow(yCoord){
  var y = parseInt(yCoord);
  if(y === Constants().FIRST_ROW){
    return true;
  }
  return false;
}

//Helper method to determine the element we have is in last row..
function checkIfTheElementIsInLastRow(yCoord){
  var y = parseInt(yCoord);
  if(y === Constants().LAST_ROW){
    return true;
  }
  return false;
}

//Helper method to check if the element is in the last column
function checkIfTheElementIsInLastColumn(xCoord){
  var x  = parseInt(xCoord);
  if(x === Constants().LAST_COLUMN){
    return true;
  }
  return false;
}

//Helper method to know if the element is in the first checkIfTheElementIsInLastColumn
function checkIfTheElementIsInTheFirstColumn(xCoord){
  var x = parseInt(xCoord);
  if(x === Constants().FIRST_COLUMN){
    return true;
  }
  return false;
}
//This function is going to break the id string in two so we can determine
//legal swaps.
function breakIdIntoCoordinates(id){
  var coordY = id[0];
  var coordX = id[1];
  return {coordX,coordY};
}
module.exports.SocketEvents = SocketEvents;

//Exported for testing purposes. This part is also the prove that we have all the
//combinations where some legals moves are illegal such as on the right edge or the
//left edge.
module.exports.DetermineThePositionOfClickedElement = DetermineThePositionOfClickedElement;
module.exports.AssignPositions = AssignPositions;

module.exports.checkIfElementIsInFirstRow = checkIfElementIsInFirstRow;//for testing purposes we need this line otherwise comment it out.
module.exports.checkIfElementIsInLastRow = checkIfTheElementIsInLastRow;
module.exports.checkIfTheElementIsInLastColumn = checkIfTheElementIsInLastColumn;
module.exports.checkIfTheElementIsInTheFirstColumn = checkIfTheElementIsInTheFirstColumn;
module.exports.checkIfElementCanHaveAllLegalMoves = checkIfElementCanHaveAllLegalMoves;
module.exports.ifElementIsInTheFirstRowOnly = ifElementIsInTheFirstRowOnly;
module.exports.ifElementIsInTheLastRowOnly = ifElementIsInTheLastRowOnly;
module.exports.ifElementIsInFirstRowAndLastColumn = ifElementIsInFirstRowAndLastColumn;
module.exports.ifElementIsInFirstRowAndFirstColumn = ifElementIsInFirstRowAndFirstColumn;
module.exports.ifElementIsInTheLastRowAndLastColumn = ifElementIsInTheLastRowAndLastColumn;
module.exports.ifElementIsInTheLastRowAndFirstColumn = ifElementIsInTheLastRowAndFirstColumn;
module.exports.ifElementIsInLastColumnOnly = ifElementIsInLastColumnOnly;
module.exports.ifElementIsInFirstColumnOnly = ifElementIsInFirstColumnOnly;
module.exports.InvalidIdArray = InvalidIdArray;
