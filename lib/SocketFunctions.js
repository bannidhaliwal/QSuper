var Constants = require('./Constants.js');
//Socket Events expects IO and GameBox Objects.
function SocketEvents(ioObject,GameBox){
  ioObject.sockets.on('connection', function (socket) {
    var clicked = false;
    var clickedElement = null;
    var potentialSwappingCandidate = null;
      GameBox.CreateGameBox(function(arrayArg){
        socket.emit("Game Initialized",{array : arrayArg});
        socket.on("ClickedOnCanvas",function (data) {
          if(clicked) {
            validSwap("81","23");
            //check if the swap is valid...
            clicked = false;
          }
          else {
            clicked = true;
            clickedElement = WhichElementWasClicked(data.X,data.Y);
          }//We have to check if an element has been clicked..
        });
      }
    );
  });
}
//This function will determine which element was clicked.
//It takes the current coordinates of mouse click and
//map them to Gamebox to determine which element was clicked.
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

function validSwap(movingElement,potentialSwappingElement,callback){
  //Check if by moving that element at destinantion position we can have
  //a valid >3 combination.

  //Break the element in two strings e.g if id is 12 than break it into 1 and 2
  //Than check if the last element is 1 and if it is than it cannot have a valid
  //move of -1. And if the last element is = 8 than it cannot have a valid move of
  //+1. We also have to check if our element is smaler than 20 and if true than
  //we cannot have a move = -10 and if the id is greater than 80 than we cannot have
  // valid move of +10.

  var legalSwaps = [];
  callback(legalSwaps);

}//End validSwap

//This is helper method for validSwap function which will determine the position
//of the clicked element and then pass it to the validSwap function.
function DetermineThePositionOfClickedElement(id,callback){
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
  return possibleMovement;
}

//Helper method of DetermineThePositionOfClickedElement function in which we pass
//category of the element and then assign the legal swaps and than call the callback
//function.
function AssignPositions(callback,array,currentPosition,positionCategory){
  var locations = {LE:"",RE:"",BRE:"",BLE:"",LC:"",RC:"",UR:"",BR:"",AL:""};
  locations.LE = [currentPosition+10,currentPosition+1];
  locations.RE = [currentPosition+10,currentPosition-1];
  locations.BRE = [currentPosition-10,currentPosition-1];
  locations.BLE = [currentPosition-10,currentPosition+1];
  locations.LC = [currentPosition-10,currentPosition+10,currentPosition+1];
  locations.RC = [currentPosition-10,currentPosition+10,currentPosition-1];
  locations.UR = [currentPosition+10,currentPosition-1,currentPosition+1];
  locations.BR = [currentPosition-10,currentPosition+1,currentPosition-1];
  locations.AL = [currentPosition+10,currentPosition-10,currentPosition+1,currentPosition-1];
  return locations[positionCategory];//for testing purposes
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
  //Check if invalid id was provided.
  var coordYAsInt = parseInt(coordY);
  var coordXAsInt = parseInt(coordX);
  if(coordXAsInt > Constants().LAST_COLUMN || coordXAsInt < Constants().FIRST_COLUMN || coordYAsInt > Constants().LAST_ROW || coordYAsInt < Constants().FIRST_ROW){
    throw new "Invalid ID provided";
  }
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
