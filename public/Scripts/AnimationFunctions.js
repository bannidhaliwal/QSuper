//This files contains the animation functions.
//@author: Navjot Singh Dhaliwal

/*
  This function will swap the elements 
  on the game canvas.
  @param data: data received from the server
  @param canvas : canvas of the game
  @param imgArray : array that contains the images
*/
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

/*
  This method will hightlight the element..
  @param data: data from the server to highlight.
  @param canvas : canvas of the game
  @param img : image array to draw the image.
  @param color : Color to use to highlight.
*/
function Highlight(data,canvas,img,color){
  DrawElements(canvas,GetXandYCoordinate(data.id).x,GetXandYCoordinate(data.id).y,0,0,img[data.element],color);
}

/*
  This method will animate the moving tiles.
  It will be called upon the poping of tiles.
  @param data: data received from the server side
  @param canvas : Canvas to draw game.
  @param imgArray : Image array to draw the elements
*/
function MoveElements(data,canvas,imgArray){
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

/*
  This function will draw the elements on the canvas.
  @param canvas : Canvas to draw the game
  @param x : x coordinate to draw
  @param y : y Coordinate to draw
  @param counterY: This is for swaping and moving funcitons.
                   We will set this counter to move the tiles
                   downwards.
  @param counterX : To move the elements left or right
*/
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

/*
  A element id consist its x and y values
  which is used to layout the element on the 
  canvas. This function returns x and y coords 
  of the element.
  @param id : id of the element. eg(41)
*/
function GetXandYCoordinate(id){
  id = ""+id;
  return {y : id[0],x : id[1]};
}

/*
  Function to swap the divs on the gamepage
  @param idToHide: div to hide
  @param idToShow: div to show
*/
function SwapDivs(idToHide,idToShow){
  document.getElementById(idToHide).style.display = "none";
  document.getElementById(idToShow).style.display = "block";
}

/*
  This function will draw the chart on the calculator page.
  @param stats: stats from the calculation function
  @param canvas : canvas to draw the calculator
*/
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
/*
  This function updates the progress bar on the
  gamepage.
  @param gameStats: Current stats of the game.
*/
function UpdateTheProgressBar(gameStats){
  var pr = document.getElementById('progressBar').getContext('2d');
  pr.fillStyle = "royalblue";
  var progress = (gameStats.score/gameStats.neededScore)*100;
  progress = Math.round((progress/100) * 390);
  pr.fillRect(0,0,progress,50);
  console.log(gameStats);
}

/*
  This method here will destroy and insert the new canvas to draw the 
  chart on the calculation page. There is a bug in the Chart.js lib 
  which will not destroy the data of the old chart, hence the chart 
  will flicker to the old data when hovered upon. To remove that bug,
  I had to delete the canvas and create a new one.
  @param callback : callback function to run after destroying and creating
                    the new canvas. canvas would be passed to this funciton

*/
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
/*
  This method will update the tuts.
  @param direction: It is next or previous flag.
*/
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