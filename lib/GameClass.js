const width = 125;
const height = 125;
var TOKENS = {
  STAR : 1,
  MOON : 2,
  SUN : 3
};

/*This is low level object and can not be accessed from outside this class.*/
function GameBox(id){
  this.id = id;
  this.element = null;
  this.xPosition = null;
  this.yPosition = null;
  this.height = height;
  this.width = width;
  this.DeterminePosition(id);
}
//Determine the position of box on Game Canvas
GameBox.prototype.DeterminePosition = function(id){
  var xOffset = getXandYOffset(id).X;
  var yOffset = getXandYOffset(id).Y;
  console.log(xOffset);
  this.xPosition = (width * xOffset) - width;
  this.yPosition = (height * yOffset) - height;
  //formula
  //id = ID  ID consists of two parts E.G -> 11. First part 1 repersents Y offset. Next part repersents X offset.
  //x offset = X-Offset
  //y Offset = Y-offset
  //width = 125
  //height = 125
  //(width * ID(X-offset))-width = X-offset.
}

//Return X and Y offsets
function getXandYOffset(id){
  var idString = id.toString();
  var XOffsetString = idString[1]; //E.g ID-> 12 -> Y = 1 & X = 2 - >12;  combination of Y & X is ID.
  var YOffsetString = idString[0];
  var XandYOffset = {
  	X : parseInt(XOffsetString),
    Y : parseInt(YOffsetString)
  };
  return XandYOffset;
}

//return X position of a Gamebox element
GameBox.prototype.ReturnXPos = function(){
  return this.xPosition;
}

//return Y pos of a Gamebox Element.
GameBox.prototype.ReturnYPos = function(){
  return this.yPosition;
}

function CreateGameBox(callback){
  var arrayOfGameBoxes = [];
  for(var OC = 1;OC<9;OC++){
    for(var IC = (10*OC)+1;IC<(10*OC)+9;IC++){
      arrayOfGameBoxes.push(new GameBox(IC,width,height));
    }
  }
  callback(arrayOfGameBoxes);
  return arrayOfGameBoxes.length; //This is never used. It is for testign purposes..
}

module.exports.CreateGameBox = CreateGameBox;
module.exports.GameBox = GameBox; //exporting for testing purposes.
