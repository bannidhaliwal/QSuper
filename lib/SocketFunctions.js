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

function validSwap(movingElement,potentialSwappingElement){
  //Check if by moving that element at destinantion position we can have
  //a valid >3 combination.

  //Break the element in two strings e.g if id is 12 than break it into 1 and 2
  //Than check if the last element is 1 and if it is than it cannot have a valid
  //move of -1. And if the last element is = 8 than it cannot have a valid move of
  //+1. We also have to check if our element is smaler than 20 and if true than
  //we cannot have a move = -10 and if the id is greater than 80 than we cannot have
  // valid move of +10.

  var legalSwaps = [];

}//End validSwap

//Helper method to check if the element is in the position where all legal movements are possible
function checkIfElementCanHaveAllLegalMoves(id){
  var xAndYCoords = breakIdIntoCoordinates(id);
  var ifTrue = checkIfElementIsInFirstRow(xAndYCoords.coordY) || checkIfTheElementIsInLastRow(xAndYCoords.coordY) || checkIfTheElementIsInLastColumn(xAndYCoords.coordX) || checkIfTheElementIsInTheFirstColumn(xAndYCoords.coordX);
  return ifTrue;
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
  if(y === 1){
    return true;
  }
  return false;
}

//Helper method to determine the element we have is in last row..
function checkIfTheElementIsInLastRow(yCoord){
  var y = parseInt(yCoord);
  if(y === 8){
    return true;
  }
  return false;
}

//Helper method to check if the element is in the last column
function checkIfTheElementIsInLastColumn(xCoord){
  var x  = parseInt(xCoord);
  if(x === 8){
    return true;
  }
  return false;
}

//Helper method to know if the element is in the first checkIfTheElementIsInLastColumn
function checkIfTheElementIsInTheFirstColumn(xCoord){
  var x = parseInt(xCoord);
  if(x === 1){
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
  if(coordXAsInt > 8 || coordXAsInt < 1 || coordYAsInt > 8 || coordYAsInt < 1){
    throw new "Invalid ID provided";
  }
  return {coordX,coordY};
}
module.exports.SocketEvents = SocketEvents;

//Exported for testing purposes. This part is also the prove that we have all the
//combinations where some legals moves are illegal such as on the right edge or the
//left edge.
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
