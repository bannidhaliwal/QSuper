var GameBox = require("./GameClassObjects.js");
var Constants = require("./Constants.js");
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
  //Find the cluster in the starting in the game.
  FindClustersHandler(gameBoxArray,RemoveCluster);
  //Give some time for algorithms to find the clusters..
  setTimeout(function(){callback(gameBoxArray);},1000);
}
//Cluster object where we store the index, length, direction and element.
function Cluster(index,length,direction,element){
  this.index = index;
  this.length = length;
  this.direction = direction;
  this.element = element;
}

//This function is the FindCluster handler. In this funciton we will pass each
//element is which is in the first row or column because we are looking for the
//horizontal and vertical clustershere..
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

//This funciton will find cluster in the given array.
//Dont use this funciton directly instead use the FindClustersHandler
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

//This function removes clusters. This function will be used in the starting of
//the game only.
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

//Function to assign the best unique element to the index to removed cluster.
//We can use this function repopulate the new elements in the game.
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

//This is a helpter method which will push corresponding element to the index
//given to the undesired element array.
function PushUndesiredElements(array,index,undesiredElementsArray){
  if(array[index] != undefined){
    undesiredElementsArray.push(array[index].element);
  }
}

//Object type to hold the information about the moving elements
function MovableElement(id,length){
  this.id = id;
  this.moveTo = (this.id + length);
}

//This function will pop the clusters made by player. After that we need to
//move the upper elements down to the array.
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
    var timeCalculatedForAnimation = (longestMovement * Constants().TIME_TAKEN_FOR_MOVING_ONE_TILE_DOWN) + 400;
    if(elementsToReposition.length > 0){
      PushElementsToBeEmptiedIntoArray(firstElementToBeEmpty,elementsToBeEmpty,lengthOfCluster,indexing);
      elementsToMoveTracker++;
    }
    //Wait 200 milliseconds so swap animation can compelete..
    setTimeout(function(){
      socket.emit("MoveElements",{elementsToReposition : elementsToReposition, elementsToPop : elementsToPop,gameArray : array});
    },200);
    EmptyElements(elementsToBeEmpty,array);
    array[Constants().SCORE].score.mutator(array[clusterArray[i].index].element,clusterArray[i].length);
    console.log(array[Constants().SCORE].score);
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
      //After swaping check for the clusters in the game array
      FindClustersHandler(array,function(clusterArray,array){
      //We use this function inside the callback to pass data to this function
      PopElements(clusterArray,array,socket);
      });
    },200);
  },timeCalculatedForAnimation);
}//End PopElements

//Method to repopulate the emptied ids
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

//Helper method push the elements that need to be emptied
function PushElementsToBeEmptiedIntoArray(firstElementToBeEmpty,elementsToBeEmpty,length,indexing){
  for(var i = 0; i < length; i++){
    elementsToBeEmpty.push((firstElementToBeEmpty)+(indexing*i));
  }
}

//Helper method to empty the elements
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
