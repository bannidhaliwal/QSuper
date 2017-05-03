//Function to swap the elements..
function SwapObjects(data,canvas,imgArray){
  console.log(data.ids.homeElement);
  console.log(data.ids.destElement);
  var destination = parseInt(data.ids.dest);
  var home = parseInt(data.ids.home);
  var counterY = 0;
  var counterX = 0;
  var direction;
  var difference = home - destination;
  var movingPixelsY = 0;
  var movingPixelsX = 0;
  switch(difference){
    case 1:{
      direction = "W";
      movingPixelsX = 10;
      break;
    }
    case -1:{
      direction = "E";
      movingPixelsX = -10;
      break;
    }
    case 10:{
      direction = "N";
      movingPixelsY = 10;
      break;
    }
    case -10:{
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
    canvas.clearRect(homeX,homeY,50,50);
    canvas.clearRect(destinationX,destinationY,50,50);
    DrawElements(canvas,GetXandYCoordinate(home).x,GetXandYCoordinate(home).y,counterY,counterX,imgArray[data.ids.destElement]);
    DrawElements(canvas,GetXandYCoordinate(destination).x,GetXandYCoordinate(destination).y,(counterY)-(counterY*2),(counterX)-(counterX*2),imgArray[data.ids.homeElement]);
  },20);
  setTimeout(function(){clearInterval(interval);},120)
}

//Helper function to clear the canvas for given elements..
function DrawElements(canvas,x,y,counterY,counterX,img){
    var coordinateX = (x-1)*50;
    var coordinateY = (y-1)*50;
    canvas.drawImage(img,coordinateX-counterX,coordinateY-counterY,50,50);

}

//Helper method get x and y coordinate from the id..
function GetXandYCoordinate(id){
  id = ""+id;
  return {y : id[0],x : id[1]};
}
