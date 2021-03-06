// This class will provide the low level game object.
// This class will provide the data to draw but wont provide any drawing functions.
var Constants = require('./Constants.js');
//Not in use for now and will be considered for the future implementation
function Score(){
  this.cash = 0;
  this.balance = 0;
  this.cocontribution = 0;
  this.mutator = (element,length)=>{
    if(element == Constants().CASH_ELEMENT){
      this.cash += length * 1000;
    }
    else if(element ==  Constants().BALANCE_ELEMENT){
      this.balance += length * 1000;
    }
    else if(element == Constants().COCONTRIBUTION_ELEMENT){
      this.cocontribution += length * 1000;
    }
  }
}//End score object

/*This is low level object and should not be accessed from outside this class.*/
function GameBox(id){
  this.id = id;
  this.element = Math.floor((Math.random() * 6));
  this.xPosition = null;
  this.yPosition = null;
  this.score = 0;
  this.scoreWithSuper = 0;
  this.scoreWithoutSuper = 0;
  this.super = 0;
  this.neededScore = 0;
  this.level = 1;
  this.moves = 0;
  this.email = "";
  this.gameOver = false;
  this.height = Constants().HEIGHT_OF_ONE_BOX;
  this.width = Constants().LENGTH_OF_ONE_BOX;
  this.DeterminePosition(id);
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

module.exports.GameObject = GameBox;
