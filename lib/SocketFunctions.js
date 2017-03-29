var Constants = require('./Constants.js');
//Socket Events expects IO and GameBox Objects.
function SocketEvents(ioObject,GameBox){
  console.log(r);
  ioObject.sockets.on('connection', function (socket) {
    var clicked = false;
      GameBox.CreateGameBox(function(arrayArg){
        socket.emit("Game Initialized",{array : arrayArg});
        socket.on("ClickedOnCanvas",function (data) {
          console.log("Element "+WhichElementWasClicked(data.X,data.Y)+" was Clicked.");
          if(clicked){clicked = false;}else {clicked = true;}
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

module.exports.SocketEvents = SocketEvents;
