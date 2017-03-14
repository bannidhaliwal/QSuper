var Constants = require('./Constants.js');

/*This is low level object and can not be accessed from outside this class.*/
function GameBox(id){
  this.id = id;
  this.element = null;
  this.xPosition = null;
  this.yPosition = null;
  this.height = Constants().HEIGHT_OF_ONE_BOX;
  this.width = Constants().LENGTH_OF_ONE_BOX;
  this.DeterminePosition(id);
  this.AssignRandomElement();
}
//Determine the position of box on Game Canvas
GameBox.prototype.DeterminePosition = function(id){
  var xOffset = GetXandYOffset(id).X;
  var yOffset = GetXandYOffset(id).Y;
  this.xPosition = (Constants().LENGTH_OF_ONE_BOX * xOffset) - Constants().LENGTH_OF_ONE_BOX;
  this.yPosition = (Constants().HEIGHT_OF_ONE_BOX * yOffset) - Constants().HEIGHT_OF_ONE_BOX;
  //formula
  //id = ID  ID consists of two parts E.G -> 11. First part 1 repersents Y offset. Next part repersents X offset.
  //x offset = X-Offset
  //y Offset = Y-offset
  //width = 125
  //height = 125
  //(width * ID(X-offset))-width = X-offset.
}

GameBox.prototype.AssignRandomElement = function(){
  this.element = randomIntFromInterval(0,(Constants().NUMBER_OF_ELEMENTS - 1)); //-1 for Array
}

//Copied from Stack Overflow. This function will return a random number.
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

//Return X and Y offsets
function GetXandYOffset(id){
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
//Return ID
GameBox.prototype.ReturnId = function(){
  return this.id;
}
//Return TOKEN
GameBox.prototype.ReturnToken = function(){
  return this.element;
}
//Set TOKEN
GameBox.prototype.SetToken = function(token){
  this.element = token;
}

module.exports.GameObject = GameBox;
