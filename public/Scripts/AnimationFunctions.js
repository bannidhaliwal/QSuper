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
  //Decide which direction is the element moving..
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
  var LENGTH_OF_ONE_TILE = 50;
  var ONE_TILE_UP = -50;
  var ONE_TILE_DOWN = 50;
  var ONE_TILE_LEFT = -50;
  var ONE_TILE_RIGHT = 50;
  var interval = setInterval(function(){
    if(counterY<ONE_TILE_DOWN && counterY > ONE_TILE_UP ){
      counterY+=movingPixelsY;
    }
    if(counterX<ONE_TILE_RIGHT && counterX > ONE_TILE_LEFT){
      counterX+=movingPixelsX;
    }
    var destinationX = ((GetXandYCoordinate(destination).x)-1)*LENGTH_OF_ONE_TILE;
    var destinationY = ((GetXandYCoordinate(destination).y)-1)*LENGTH_OF_ONE_TILE;
    var homeX = ((GetXandYCoordinate(home).x)-1)*LENGTH_OF_ONE_TILE;
    var homeY = ((GetXandYCoordinate(home).y)-1)*LENGTH_OF_ONE_TILE;
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
  var LENGTH_OF_ONE_TILE = 50;
  var ONE_TILE_DOWN = -50;
  var firstElement = data.elementsToReposition[0].id;
  var lastElement = data.elementsToReposition[data.elementsToReposition.length - 1].id;
  var firstColumn = parseInt(GetXandYCoordinate(firstElement).x);
  var lastColumn = parseInt(GetXandYCoordinate(lastElement).x);
  var firstRow = parseInt(GetXandYCoordinate(firstElement).y);
  var lastRow = parseInt(GetXandYCoordinate(data.elementsToReposition[data.elementsToReposition.length - 1].moveTo).y);
  var heightToClear = ((lastRow - firstRow) + 1) * LENGTH_OF_ONE_TILE;
  var widthToClear = ((lastColumn - firstColumn) + 1) * LENGTH_OF_ONE_TILE;
  var startingX = (parseInt(GetXandYCoordinate(firstElement).x) * LENGTH_OF_ONE_TILE) - LENGTH_OF_ONE_TILE;
  var startingY = (parseInt(GetXandYCoordinate(firstElement).y) * LENGTH_OF_ONE_TILE) - LENGTH_OF_ONE_TILE;
  var counterY = 0;
  var rowsToMove = lastRow - firstRow;
  //Clear all the elements which need to be moved so we can animate movements.
  canvas.clearRect(startingX,startingY,widthToClear,heightToClear);
  //Now we need to move the elements down..

  var movingDownDistance = (data.elementsToReposition[0].moveTo - data.elementsToReposition[0].id)/10;//Here we are checking that how many tiles we have to move..
  movingDownDistance = (ONE_TILE_DOWN) * movingDownDistance;
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
  }
  ,timeTakenForAnimation);
}

//Helper function to draw elements on the given x and y coordinates..
function DrawElements(canvas,x,y,counterY,counterX,img,color){
    var LENGTH_OF_ONE_TILE = 50;
    var HEIGH_OF_ONE_TILE = 50;
    var coordinateX = (x-1)*LENGTH_OF_ONE_TILE;
    var coordinateY = (y-1)*LENGTH_OF_ONE_TILE;
    canvas.fillStyle = color;
    canvas.fillRect(coordinateX,coordinateY,LENGTH_OF_ONE_TILE,HEIGH_OF_ONE_TILE);
    canvas.fillRect(coordinateX-counterX,coordinateY-counterY,LENGTH_OF_ONE_TILE,HEIGH_OF_ONE_TILE);
    canvas.drawImage(img,coordinateX-counterX,coordinateY-counterY,LENGTH_OF_ONE_TILE,HEIGH_OF_ONE_TILE);
}

//Helper method get x and y coordinate from the id..
function GetXandYCoordinate(id){
  id = ""+id;
  return {y : id[0],x : id[1]};
}

//This function will display the game over screen
function SwapDivs(idToHide,idToShow){
  document.getElementById(idToHide).style.display = "none";
  document.getElementById(idToShow).style.display = "block";
}

function DrawChart(stats,canvas){
  var WITH_SUPER = 1;
  var WITHOUT_SUPER = 0;
  var idOfCanvas = "myChart";
  var ctx = canvas.getContext('2d');
  document.getElementById(idOfCanvas).style.display = 'block';
  ctx.clearRect(0,0,500,500);
  var myChart;
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Net salary', 'Net super balance', 'Tax', 'Medicare'],
      datasets: [{
        label: 'With contribution(Annualy)',
        data: [stats.netSalary[WITH_SUPER], stats.netSuperBalance[WITH_SUPER], stats.tax[WITH_SUPER], stats.medicareLevy[WITH_SUPER]],
        backgroundColor: "rgba(153,255,51,0.6)"
      }, {
        label: 'Without contribution(Annualy)',
        data: [stats.netSalary[WITHOUT_SUPER], stats.netSuperBalance[WITHOUT_SUPER], stats.tax[WITHOUT_SUPER], stats.medicareLevy[WITHOUT_SUPER]],
        backgroundColor: "rgba(255,153,0,0.6)"
      }]
    },
    options:{
      responsive : false
    }
  });
}

function UpdateTheProgressBar(gameStats){
  var pr = document.getElementById('progressBar').getContext('2d');
  pr.fillStyle = "royalblue";
  var progress = (gameStats.score/gameStats.neededScore)*100;
  progress = Math.round((progress/100) * 390);
  pr.fillRect(0,0,progress,50);
  console.log(gameStats);
}

function DestroyAndInsertNewCanvasElement(callback){
  var parentOfCanvas = document.getElementById('canvasWrapper');
  var chartElement = document.getElementById('myChart');
  parentOfCanvas.removeChild(chartElement);
  var newCanvas = document.createElement('canvas');
  newCanvas.height = "500";
  newCanvas.width = "500";
  newCanvas.id = "myChart";
  parentOfCanvas.appendChild(newCanvas);
  parentOfCanvas.style.height = "500px";
  parentOfCanvas.style.height = "500px";
  callback(newCanvas);
}

function UpdateTut(direction){
  var gameTutorial = document.getElementById('gameTutorial');
  var currentTut = parseInt(document.getElementById('currentTut').innerHTML);
  if(direction == "next" && currentTut < 3){
    var nextTut = (currentTut + 1);
    nextTut = nextTut + "tut.png";
    document.getElementById('currentTut').innerHTML = nextTut;
    gameTutorial.style.backgroundImage = "url('"+nextTut+"')";
  }
  else if(direction == "previous" && currentTut > 1){
    var previousTut = (currentTut - 1);
    previousTut = previousTut + "tut.png";
    document.getElementById('currentTut').innerHTML = previousTut;
    gameTutorial.style.backgroundImage = "url('"+previousTut+"')";
  }
}