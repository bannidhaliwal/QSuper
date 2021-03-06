/*
  This lib will create the game box and will pass it to the
  callback function. Callback function will emit the events
  draw the canvas. For usage check SocketFunctions.js

  @author : Navjot Singh Dhaliwal
*/
var GameBox = require("./GameClassObjects.js");
var Constants = require("./Constants.js");
var SQL = require('./SQL.js');
var mySqlObject = require('mysql');
var CalculateStats = require('./CalculationsForServerSide.js');
var gameBoxArray = [];
/*
  This function will create an array and then 
  pass it to the callback function. Here we implement
  all the logic of creating and placing the elments on
  the game box.

  @param callback : callback function to pass the game array
  @param initializationData : Array that contains the email if logged in.
*/
function CreateGameBox(callback,initializationData){
  gameBoxArray = [];
  for(var OC = 1;OC<9;OC++){ //OC stands for Outer Counter
    for(var IC = (10*OC)+1;IC<(10*OC)+9;IC++){ //IC inner counter which is also going to be our ID.
      gameBoxArray[IC] = (new GameBox.GameObject(IC));
    }
  }
  GetUserDataAndInitiateGame(initializationData,(results)=>{
    UpdateTheGameArray(gameBoxArray,results);
    FindClustersHandler(gameBoxArray,RemoveCluster);
    setTimeout(function(){callback(gameBoxArray);},1000);
  });
}
/*
  This function will update the game array.
  We are storing the information such as level 
  and moves for the current level being played.

  @param gameArray : Main array for the game..
  @param results : results from the database
*/
function UpdateTheGameArray(gameArray,results){
  if(results == "empty"){
    gameArray[Constants().LEVEL_INFORMATION].level = 1;
    gameArray[Constants().LEVEL_INFORMATION].moves = 13;
    gameArray[Constants().LEVEL_INFORMATION].email = "guest";
    gameArray[Constants().LEVEL_INFORMATION].neededScore = (13*3000)+5000;
  }
  else{
    console.log(results);
    gameArray[Constants().LEVEL_INFORMATION].level = results[0].level;
    gameArray[Constants().LEVEL_INFORMATION].moves = 13;
    gameArray[Constants().LEVEL_INFORMATION].email = results[0].email;
    gameArray[Constants().LEVEL_INFORMATION].scoreWithSuper = results[0].score;
    gameArray[Constants().LEVEL_INFORMATION].scoreWithoutSuper = results[0].scoreWithoutSuper;
    gameArray[Constants().LEVEL_INFORMATION].super = results[0].super; 
    SetAimScore(gameArray[Constants().LEVEL_INFORMATION].level,gameArray);   
  }
}
/*
  This function will decide the movements and 
  aim score for the current level.

  @param level : Current level
*/
function SetAimScore(level,gameArray){
  switch(level){
    case 1:{
      gameArray[Constants().LEVEL_INFORMATION].moves = Constants().FIRST_LEVEL_MOVES;
      gameArray[Constants().LEVEL_INFORMATION].neededScore = (Constants().FIRST_LEVEL_MOVES * 3000)+5000; 
      break;
    }
    case 2:{
      gameArray[Constants().LEVEL_INFORMATION].moves = Constants().SECOND_LEVEL_MOVES;
      gameArray[Constants().LEVEL_INFORMATION].neededScore = (Constants().SECOND_LEVEL_MOVES * 3000)+5000;
      break;
    }
    case 3:{
      gameArray[Constants().LEVEL_INFORMATION].moves = Constants().THIRD_LEVEL_MOVES;
      gameArray[Constants().LEVEL_INFORMATION].neededScore = (Constants().THIRD_LEVEL_MOVES * 3000)+5000;
      break;
    }
    case 4:{
      gameArray[Constants().LEVEL_INFORMATION].moves = Constants().FOURTH_LEVEL_MOVES;
      gameArray[Constants().LEVEL_INFORMATION].neededScore = (Constants().FOURTH_LEVEL_MOVES * 3000)+5000;
      break;
    }
    case 5:{
      gameArray[Constants().LEVEL_INFORMATION].moves = Constants().FIFTH_LEVEL_MOVES;
      gameArray[Constants().LEVEL_INFORMATION].neededScore = (Constants().FIFTH_LEVEL_MOVES * 3000)+5000;
      break;
    }
  }
}
/*
  This funtion will get the game information and get the email out of that data.
  Then we will pass that data to the callback function after error checking..

  @param gameData : Session of the game
  @param callback : callback function to pass the data reterieved from the database
*/
function GetUserDataAndInitiateGame(gameData,callback){
  console.log(gameData);
  if(gameData.email == ""){
    var empty = "empty";
    callback(empty);
    return 0;
  }
  var query = 'SELECT * FROM `Users` where `email` = "'+gameData.email+'";';
  var mySqlConnection = SQL.MySqlConnection(mySqlObject,query,(results,flag)=>{
    if(flag == "error"){
      console.log("error");
    }
    else{
      callback(results);
    }
  });
}
/*
  This object will store clusters.

  @param index : index at which cluster starting
  @param length : length of the cluster
  @param direction : direction of the cluster (HORIZONTAL_DIRECTION,VERTICAL_DIRECTION)
  @param element : element type of the cluster
*/
function Cluster(index,length,direction,element){
  this.index = index;
  this.length = length;
  this.direction = direction;
  this.element = element;
}

/*
  This function handles inputs for FindCluster
  method. It will pass the neceassary starting points
  for FindCluster method to execute.
  @param array: Game Array to find cluster
  @param callback: Callback to pass to FindClusters
*/
function FindClustersHandler(array,callback){
	for(var i = 1;i<9;i++){
  	var j = 1;
    //Here starting value is the first element in every row..
    var startingValue = parseInt(""+i+j);
    var endValue = startingValue+7;
   	FindClusters(array,startingValue,endValue,Constants().HORIZONTAL_DIRECTION,callback);
    //Here the staring value is every column..
    startingValue = parseInt(""+1+i);
  	endValue = startingValue + 70;
    FindClusters(array,startingValue,endValue,Constants().VERTICAL_DIRECTION,callback);
  }
}//end FindClustersHandler

/*
  This method will find the cluster in the given array
  in horizontal and vertical direction. A cluster is a 
  occurence of three elements in vertical or horizontal 
  direction. After finding cluster, it will store clusters
  in an array and pass that array to the callback function.

  @param array: Game array to find cluster
  @param starting value: Where should the function start checking 
                          from.
  @param endValue : Where should it stop.
  @param direction: Horizontal or vertical direction
  @param callback: Method to deal with clusters.
*/
function FindClusters(array,startingValue,endValue,direction,callback){
	var clusters = [];//Array to contain clusters indexes
  var increasingValue = 0;
  //Here we decide if we are checking the clusters in the horizontal or vertical
  //direction
  if(direction === Constants().HORIZONTAL_DIRECTION){
  	increasingValue = Constants().HORIZONTAL;
  }
  else{
  	increasingValue = Constants().VERTICAL;
  }
  //We have two for loops to compare each element with the next elements.
  for(var i = startingValue;i<=endValue;i+=increasingValue){
  	var cluster = 1;
    for(var k = startingValue;k<=endValue;k+=increasingValue){
    	if(k>i){
        if(array[i].element == array[k].element && array[i].element !=6){
          cluster++;
        }
        if(array[i].element != array[k].element || k >= endValue){
          if(cluster > 2){
            clusters.push(new Cluster(i,cluster,direction,array[i].element));
          }
          i = (i + (increasingValue * cluster)) - increasingValue;
          break;
        }
      }
    }//end K counter
  }//end i counter
  //If we have any clusters than pass the data and execute the callback..
  if(clusters.length > 0){
    callback(clusters,array);// Pass the cluster array and game array to callback.
  }
}//End FindClusters

/*
  This function removes the clusters from the array.
  This function will be called in the starting of the
  game only.

  @param clusterArray: Array of clusters in game array
  @param array: Game array 
*/
function RemoveCluster(clusterArray,array){
  var undesiredElements = [];//Here we are going to store the elements that are not wanted into that index.
  //if we have clusters..
  if(clusterArray.length !== Constants().EMPTY){
    for(var i = 0;i<clusterArray.length;i++){
      //Here we check if we have a horizontal or vertical cluster..
      var indexing = Constants().HORIZONTAL;
      if(clusterArray[i].direction === Constants().VERTICAL_DIRECTION){
        indexing = Constants().VERTICAL;
      }
      //This is the array which will hold the undesired elements that we dont need for the current element.
      var offsetOfUndesiredElements = [Constants().CURRENT_ELEMENT,Constants().LEFT_ELEMENT,Constants().RIGHT_ELEMENT,Constants().BOTTOM_ELEMENT,Constants().UPPER_ELEMENT];
      for(var k = 0;k<clusterArray[i].length;k+=indexing){
        for(var j = 0;j<offsetOfUndesiredElements.length;j++){
          PushUndesiredElements(array,((clusterArray[i].index)+k)+offsetOfUndesiredElements[j],undesiredElements);
        }
        //for the current elemement assign the most suitable element.
        array[(clusterArray[i].index)+k].element = AssignUniqueElementToRemoveTheCluster(undesiredElements);
        undesiredElements = [];//clear the array of undesired elements
      }//end k counter
    }//end counter i
  }
}//End RemoveCluster

/*
  This function assign the unique elements to the each 
  element in the cluster.

  @param undesiredElementsArray: Undesired elements that we dont 
                                 need for the current element. 
*/
function AssignUniqueElementToRemoveTheCluster(undesiredElementsArray){
  var desiredElements = [];
  var finalElement = 0;
  //Here we check that which elements are not in undesired list..
  for(var i = 0;i<Constants().NUMBER_OF_ELEMENTS;i++){
    var contains = false;
    for(var j = 0;j<undesiredElementsArray.length;j++){
      if(i === undesiredElementsArray[j]){
        contains = true;
        break;
      }//end if
    }//end for
    if(!contains){
      //push the element into the desired list which is not in undesired list..
      desiredElements.push(i);
    }
  }//end outer for
  //get an random element out of that list..
  finalElement = desiredElements[Math.floor((Math.random() * (desiredElements.length - 1)))];
  return finalElement;
}//AssignUniqueElementToRemoveTheCluster

/*
  This function will push the index value element to the 
  undesired elements list.
  @param array : Game array
  @param index : index of the element to push into undesiredElements list.
  @param undesiredElementsArray: Undesired elements
*/
function PushUndesiredElements(array,index,undesiredElementsArray){
  if(array[index] != undefined){
    undesiredElementsArray.push(array[index].element);
  }
}

/*
  Object for the elements who need to be moved.
  @param id: Id of the element.
  @param length: length to move. Like 3 tiles or 4 tiles.
*/
function MovableElement(id,length){
  this.id = id;
  this.moveTo = (this.id + length);
}

/*
  This function will pop the elements after user 
  has made any clusters. This function will also emit 
  the events of the moveElements for the client side.

  @param clusterArray: Array of clusters
  @param array : Game array
  @param socket: socket to pass data to client side
  @param score: Current score of the user
*/
function PopElements(clusterArray,array,socket,score){
  //This variable is for checking which move is the longest..
  var longestMovement = 1;
  var tempLongestMovement = 0;
  var elementsToMoveTracker = 0;
  for(var i = 0;i<clusterArray.length;i++){
    var direction = clusterArray[i].direction;
    var lengthOfCluster = clusterArray[i].length;
    var elementsToPop = [];
    var elementsToReposition = [];
    var indexing = Constants().HORIZONTAL;
    if(direction == Constants().VERTICAL_DIRECTION){
      indexing = Constants().VERTICAL;
        tempLongestMovement = (clusterArray[i].length);
    }
    if(tempLongestMovement > longestMovement){
      longestMovement = tempLongestMovement;
    }
    //for loop to push the elements needed to pop.
    for(var j = 0;j<lengthOfCluster;j++){
      elementsToPop.push((clusterArray[i].index)+(j*indexing));
    }//end for j
    //This part will decide which elements needed to be moved..
    ElementsToMove(clusterArray[i].index,clusterArray[i].direction,clusterArray[i].length,elementsToReposition);
    for(var k = 0;k<elementsToPop.length;k++){
      array[elementsToPop[k]].element = Constants().EMPTY_ELEMENT;
    }//End for k
    var firstElementToBeEmpty;
    var elementsToBeEmpty = [];
    //Manipulate the array to change the positions of moving elements.
    //We are not drawing here just changing the position in array.
    for(var l = (elementsToReposition.length)-1; l>=0;l--){
      var destination = elementsToReposition[l].moveTo;
      var home = elementsToReposition[l].id;
      array[destination].element = array[home].element;
      firstElementToBeEmpty = array[home].id;
    }
    //We are calculating the time on the basis of how many tiles we have to move down
    //and add 400 milliseconds on top of it..
    var timeCalculatedForAnimation = (longestMovement * Constants().TIME_TAKEN_FOR_MOVING_ONE_TILE_DOWN) + 700;
    if(elementsToReposition.length > 0){
      PushElementsToBeEmptiedIntoArray(firstElementToBeEmpty,elementsToBeEmpty,lengthOfCluster,indexing);
      elementsToMoveTracker++;
    }
    //Wait 200 milliseconds so swap animation can compelete..
    setTimeout(function(){
      socket.emit("MoveElements",{elementsToReposition : elementsToReposition, elementsToPop : elementsToPop,gameArray : array});
    },200);
    EmptyElements(elementsToBeEmpty,array);
    //Increase the score
    array[Constants().LEVEL_INFORMATION].score += clusterArray[i].length * 1000;
    //Check if the game has ended
  }//End counter i
  //if any of the cluster dont make any movement of any elements..
  if(elementsToMoveTracker == 0){
    timeCalculatedForAnimation = 200;
  }
  //Here we are letting the moving animation complete and then redrawing the
  //whole game as we have changed the array at backend..
  setTimeout(function(){
    socket.emit("Redraw",{array : array});
    //Give some time and then repopulate the elements in the emptied elements.
    setTimeout(function(){
      RepopulateTheElements(array);
      socket.emit("Redraw",{array : array});
      if(array[Constants().LEVEL_INFORMATION].gameOver == false){
        //After swaping check for the clusters in the game array
        FindClustersHandler(array,function(clusterArray,array){
        //We use this function inside the callback to pass data to this function
        PopElements(clusterArray,array,socket);
        });
      }
      GameEnded(array,socket);
    },200);
  },timeCalculatedForAnimation);
}//End PopElements

/*
  This method will check if the game ended. 
  It will decide either by the  movements left 
  and the score of the game..

  @param gameArray: Game array 
  @param socket: socket to pass the data to the client side
*/
function GameEnded(gameArray,socket){
  if(gameArray[Constants().LEVEL_INFORMATION].score >= gameArray[Constants().LEVEL_INFORMATION].neededScore){
    console.log("Game won");
    gameArray[Constants().LEVEL_INFORMATION].gameOver = true;
    socket.emit("GameWon",{levelData : gameArray[Constants().LEVEL_INFORMATION]});
    socket.on("SaveData",(data)=>{
      SaveGame(gameArray,data.contribution,socket);
    });
  }
  else if((gameArray[Constants().LEVEL_INFORMATION].moves) <=0){
    socket.emit("GameLost",{levelData : gameArray[Constants().LEVEL_INFORMATION]});
  }
}
/*
  This function will save the data to the database on 
  when user clear a level..
  @param gameArray : Game Array that contains the data
                     such as score and level.
  @param userData : super contribution value as percentage.
*/
function SaveGame(gameArray,superContribution,socket){
  var WITH_SUPER = 1;
  var WITHOUT_SUPER = 0;
  var currentLevel = gameArray[Constants().LEVEL_INFORMATION].level;
  var nextLevel = currentLevel + 1;
  var email = gameArray[Constants().LEVEL_INFORMATION].email;
  var score = gameArray[Constants().LEVEL_INFORMATION].score;
  var currentLevel = gameArray[Constants().LEVEL_INFORMATION].level;
  CalculateStats.CalculateStats(score,(score*(superContribution/100)),1,1,function(data){
    score = data.assets[WITH_SUPER];
    scoreWithoutSuper = data.assets[WITHOUT_SUPER];
    score += gameArray[Constants().LEVEL_INFORMATION].scoreWithSuper;
    scoreWithoutSuper += gameArray[Constants().LEVEL_INFORMATION].scoreWithoutSuper;
    var userSuper = data.netSuperBalance[WITH_SUPER];
    userSuper += gameArray[Constants().LEVEL_INFORMATION].super;
    /*
      if next levels exceed the number of levels
      then we are not increasing the level and 
      userSuper as well..
    */
    if(nextLevel > Constants().NO_OF_LEVELS){
      nextLevel--;
      userSuper -= gameArray[Constants().LEVEL_INFORMATION].super;
      scoreWithoutSuper += gameArray[Constants().LEVEL_INFORMATION].scoreWithoutSuper;
    }
    /*
      If we dont have the email, then we are not saving anything..
    */
    if(email == "guest"){
      socket.emit("RefreshPage",{});
      return 0;
    }
    var query = "UPDATE `Users` SET  `level` = "+nextLevel+", `super` = "+userSuper+", `score` = "+score+", `scoreWithoutSuper`="+scoreWithoutSuper+" WHERE `email` = '"+email+"';";
    console.log(query); 
    var mysqlConnection = SQL.MySqlConnection(mySqlObject,query,(results,flag)=>{
      if(flag == "error"){
        console.log("Error");
      }
      else{
        console.log(results);
        socket.emit("RefreshPage",{});
      }
    });
  });
}//End SaveGame
/*
  This function is used to the repopulate the 
  popped elements. When we pop the elements we
  set the element to the 6. When we iterate through 
  the array, we check if the element is 6.
  @param gameArray : The array for the game element.
*/
function RepopulateTheElements(gameArray){
  var elementsToBeRepopulated = [];
  for(var i = 0;i < gameArray.length; i++){
    if(gameArray[i] != null){
      if(gameArray[i].element == 6){
        elementsToBeRepopulated.push(gameArray[i].id);
      }
    }
  }
  var undesiredElements = [];
  var offsetOfUndesiredElements = [Constants().CURRENT_ELEMENT,Constants().LEFT_ELEMENT,Constants().RIGHT_ELEMENT,Constants().BOTTOM_ELEMENT,Constants().UPPER_ELEMENT];
  for(var k = 0;k<elementsToBeRepopulated.length;k++){
    for(var j = 0;j<offsetOfUndesiredElements.length;j++){
      PushUndesiredElements(gameArray,(elementsToBeRepopulated[k])+offsetOfUndesiredElements[j],undesiredElements);
    }
    gameArray[elementsToBeRepopulated[k]].element = AssignUniqueElementToRemoveTheCluster(undesiredElements);
    undesiredElements = [];//clear the array of undesired elements
  }//end k counter
}

/*
  Helper method push the elements that need to be emptied

*/
function PushElementsToBeEmptiedIntoArray(firstElementToBeEmpty,elementsToBeEmpty,length,indexing){
  for(var i = 0; i < length; i++){
    elementsToBeEmpty.push((firstElementToBeEmpty)+(indexing*i));
  }
}

/*
  Helper method to empty the elements
  @param elementsToEmpty: array of the emptied elements
  @param gameArray : Game array
*/
function EmptyElements(elementsToEmpty,gameArray){
  for(var i = 0;i < elementsToEmpty.length;i++){
    gameArray[elementsToEmpty[i]].element = 6;
  }
}

//This funciton will determine which elements need to be moved after we have popped
//the elements and push them to the elementsToReposition array passed.
function ElementsToMove(clusterIndex,direction,length,elementsToReposition){
  switch(direction){
    case Constants().VERTICAL_DIRECTION:{
      var firstRow = CurrentColumn(clusterIndex);
      var numbersOfElements = (clusterIndex - firstRow)/10;
      for(var i = 0;i<numbersOfElements;i++){
        elementsToReposition.push(new MovableElement(firstRow+(10*i),length*10));
      }
      break;
    }//End case "V"
    case Constants().HORIZONTAL_DIRECTION:{
      var firstElement = clusterIndex;
      var lastElement = (clusterIndex + length)-1;
      for(var j = firstElement;j<=lastElement;j++){
        var firstRow = CurrentColumn(j);
        var numbersOfElements = (j - firstRow)/10;
        for(var i = 0;i<numbersOfElements;i++){
          elementsToReposition.push(new MovableElement(firstRow+(10*i),10));
        }
      }
      break;
    }//End case "H"
  }
}//End ElementsToMove

//Helper method to know which row is it
function CurrentRow(index){
  index = index+"";
  return parseInt(index[0]+"8");
}

//Helper function to get the first row of the current element
function CurrentColumn(index){
  index = index+"";
  return parseInt("1"+index[1]);
}
module.exports.CreateGameBox = CreateGameBox;
module.exports.FindClustersHandler = FindClustersHandler;
module.exports.PopElements = PopElements;
