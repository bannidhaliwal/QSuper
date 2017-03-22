var GameBox = require("./GameClassObjects.js");

var gameBoxArray = []; //Contains all Boxes on game board.
//Initialize GameBox.
function CreateGameBox(callback){ //Callback function will be passed with array of game box.
  //Here we have two for loops. Outer for loop will be increasing through
  //1 to 8. We are having 8 rows and 8 columns. This loop will give us
  //64 elements. All elements are relevant to each other. First element
  //in first column would be 11 and 18 in last. And next rows will keep increasing
  //by 10 with each row.We are storing each element at index(ID) so when we need
  //an element 11, we can simply say gameBoxArray[11].
  for(var OC = 1;OC<9;OC++){ //OC stands for Outer Counter
    for(var IC = (10*OC)+1;IC<(10*OC)+9;IC++){ //IC inner counter which is also going to be our ID.
      gameBoxArray[IC] = (new GameBox.GameObject(IC));
    }
  }
  callback(gameBoxArray); //Pass array to callback.
}
module.exports.CreateGameBox = CreateGameBox;
