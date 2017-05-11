//This files contains the animation functions.
//@author: Navjot Singh Dhaliwal

//Function to swap the elements..
function SwapObjects(data,canvas,imgArray){
  var SOUTH = -10;
  var NORTH = 10;
  var EAST = -1;
  var WEST = 1;
  var destination = parseInt(data.ids.dest);
  var home = parseInt(data.ids.home);
  var counterY = 0;
  var counterX = 0;
  var direction;
  var difference = home - destination;
  var movingPixelsY = 0;
  var movingPixelsX = 0;
  switch(difference){
    //Minus 10 and 10 are the pixels moving for animation
    case WEST:{
      direction = "W";
      movingPixelsX = 10;
      break;
    }
    case EAST:{
      direction = "E";
      movingPixelsX = -10;
      break;
    }
    case NORTH:{
      direction = "N";
      movingPixelsY = 10;
      break;
    }
    case SOUTH:{
      direction = "S";
      movingPixelsY = -10;
      break;
    }
  }
  var interval = setInterval(function(){
    if(counterY<50 && counterY > -50 ){
      counterY+=movingPixelsY;
    }
    if(counterX<50 && counterX > -50){
      counterX+=movingPixelsX;
    }
    var destinationX = ((GetXandYCoordinate(destination).x)-1)*50;
    var destinationY = ((GetXandYCoordinate(destination).y)-1)*50;
    var homeX = ((GetXandYCoordinate(home).x)-1)*50;
    var homeY = ((GetXandYCoordinate(home).y)-1)*50;
    /*canvas.clearRect(homeX,homeY,50,50);
    canvas.clearRect(destinationX,destinationY,50,50);*/
    DrawElements(canvas,GetXandYCoordinate(home).x,GetXandYCoordinate(home).y,counterY,counterX,imgArray[data.ids.destElement],"white");
    DrawElements(canvas,GetXandYCoordinate(destination).x,GetXandYCoordinate(destination).y,(counterY)-(counterY*2),(counterX)-(counterX*2),imgArray[data.ids.homeElement],"white");
  },20);
  setTimeout(function(){clearInterval(interval);},120)
}

//This method will highlight the selected element.
function Highlight(data,canvas,img,color){
  DrawElements(canvas,GetXandYCoordinate(data.id).x,GetXandYCoordinate(data.id).y,0,0,img[data.element],color);
}

//Function to animate the movement of elements after the popping of the element
function MoveElements(data,canvas,imgArray,socket){
  if(data.elementsToReposition.length == 0){
    socket.emit("RedrawAfterMoving",{});
    return 0;//If we have no elements to move just simply return and do nothing..
  }
  var firstElement = data.elementsToReposition[0].id;
  var lastElement = data.elementsToReposition[data.elementsToReposition.length - 1].id;
  var firstColumn = parseInt(GetXandYCoordinate(firstElement).x);
  var lastColumn = parseInt(GetXandYCoordinate(lastElement).x);
  var firstRow = parseInt(GetXandYCoordinate(firstElement).y);
  var lastRow = parseInt(GetXandYCoordinate(data.elementsToReposition[data.elementsToReposition.length - 1].moveTo).y);
  var heightToClear = ((lastRow - firstRow) + 1) * 50;
  var widthToClear = ((lastColumn - firstColumn) + 1) * 50;
  var startingX = (parseInt(GetXandYCoordinate(firstElement).x) * 50) - 50;
  var startingY = (parseInt(GetXandYCoordinate(firstElement).y) * 50) - 50;
  var counterY = 0;
  var rowsToMove = lastRow - firstRow;
  //Clear all the elements which need to be moved so we can animate movements.
  canvas.clearRect(startingX,startingY,widthToClear,heightToClear);
  //Now we need to move the elements down..

  var movingDownDistance = (data.elementsToReposition[0].moveTo - data.elementsToReposition[0].id)/10;//Here we are checking that how many tiles we have to move..
  movingDownDistance = (-50) * movingDownDistance;
  var movingIntervalTime = 10;
  var timeTakenForAnimation = Math.abs((movingDownDistance * movingIntervalTime)) + 10;
  var movingInterval = setInterval(function(){
    for(var currentElement = (data.elementsToReposition.length - 1);currentElement>=0;currentElement--){
      DrawElements(canvas,GetXandYCoordinate(data.elementsToReposition[currentElement].id).x,GetXandYCoordinate(data.elementsToReposition[currentElement].id).y,counterY,0,imgArray[data.gameArray[data.elementsToReposition[currentElement].moveTo].element],"white");
    }
    if(counterY > movingDownDistance){
      counterY-=2;
    }
  },movingIntervalTime);
  setTimeout(function(){
    clearInterval(movingInterval);
    console.log(timeTakenForAnimation)
  }
  ,timeTakenForAnimation);
}

//Helper function to draw elements on the given x and y coordinates..
function DrawElements(canvas,x,y,counterY,counterX,img,color){
    var coordinateX = (x-1)*50;
    var coordinateY = (y-1)*50;
    canvas.fillStyle = color;
    canvas.fillRect(coordinateX,coordinateY,50,50);
    canvas.fillRect(coordinateX-counterX,coordinateY-counterY,50,50);
    canvas.drawImage(img,coordinateX-counterX,coordinateY-counterY,50,50);
}

//Helper method get x and y coordinate from the id..
function GetXandYCoordinate(id){
  id = ""+id;
  return {y : id[0],x : id[1]};
}
