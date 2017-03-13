var GameBox = require("./GameClassObjects.js");
var TOKENS = {
  STAR : 1,
  MOON : 2,
  SUN : 3
};
var gameBoxArray = []; //Contains all Boxes on game board.
//Initialize GameBox.
function CreateGameBox(callback){ //Callback function will be passed with array of game box.
  for(var OC = 1;OC<9;OC++){ //OC stands for Outer Counter
    for(var IC = (10*OC)+1;IC<(10*OC)+9;IC++){ //IC inner counter which is also going to be our ID.
      gameBoxArray[IC] = (new GameBox.GameObject(IC));
    }
  }
  callback(gameBoxArray);
  return gameBoxArray.length; //This is never used. It is for testign purposes..
}

function ReturnSpecificElementFromArray(id){
  return gameBoxArray[id];
}

module.exports.CreateGameBox = CreateGameBox;
module.exports.ReturnSpecificElementFromArray = ReturnSpecificElementFromArray; //for testing purposes.
module.exports.TOKENS = TOKENS;
