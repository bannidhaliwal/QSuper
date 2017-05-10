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
  //We have to run the find cluster function in loop until we dont have any
  //cluster left in the game array.
  console.log("New");
  FindClustersHandler(gameBoxArray,RemoveCluster);
  setTimeout(function(){callback(gameBoxArray);},1000);
}
//Cluster object where we store the index, length, direction and element.
function Cluster(index,length,direction,element){
  this.index = index;
  this.length = length;
  this.direction = direction;
  this.element = element;
}

//This funciton is going to handle the FindCluster function.
//Call this funciton instead of FindClusters itself.
function FindClustersHandler(array,callback){
	for(var i = 1;i<9;i++){
  	var j = 1;
    var startingValue = parseInt(""+i+j);
    var endValue = startingValue+7;
   	FindClusters(array,startingValue,endValue,"H",callback);
    startingValue = parseInt(""+1+i);
  	endValue = startingValue + 70;
    FindClusters(array,startingValue,endValue,"V",callback);
  }
}//end FindClustersHandler

//This funciton will find cluster in the given array.
//Dont use this funciton directly instead use the FindClustersHandler

//Test this function.l
function FindClusters(array,startingValue,endValue,direction,callback){
	var clusters = [];//Array to contain clusters indexes
  var increasingValue = 0;
  //Here we decide if we are checking the clusters in the horizontal or vertical
  //direction
  if(direction === "H"){
  	increasingValue = 1;//Horizontal
  }
  else{
  	increasingValue = 10;//Vertical
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
  callback(clusters,array);// Pass the cluster array and game array to callback.
}//End FindClusters

//This function removes clusters. This function will be used in the starting of
//the game only.
function RemoveCluster(clusterArray,array){
  var undesiredElements = [];
  if(clusterArray.length !== 0){
    for(var i = 0;i<clusterArray.length;i++){
      var indexing = 1;
      if(clusterArray[i].direction === "V"){
        indexing = 10;
      }
      var offsetOfUndesiredElements = [0,-1,1,10,-10];
      for(var k = 0;k<clusterArray[i].length;k+=indexing){
        for(var j = 0;j<offsetOfUndesiredElements.length;j++){
          PushUndesiredElements(array,((clusterArray[i].index)+k)+offsetOfUndesiredElements[j],undesiredElements);
        }
        array[(clusterArray[i].index)+k].element = AssignUniqueElementToRemoveTheCluster(undesiredElements);
        undesiredElements = [];//clear the array of undesired elements
      }//end k counter
    }//end counter i
  }
}//End RemoveCluster

//Function to assign the best unique element to the index to removed cluster.
//We can use this function repopulate the new elements in the game.
function AssignUniqueElementToRemoveTheCluster(undesiredElementsArray){
  for(var i = 0;i<6;i++){
    var contains = false;
    for(var j = 0;j<undesiredElementsArray.length;j++){
      if(i === undesiredElementsArray[j]){
        contains = true;
        break;
      }//end if
    }//end for
    if(!contains){
      return i;
    }
  }//end outer for
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
function PopElements(clusterArray,array,socket){
  for(var i = 0;i<clusterArray.length;i++){
    var direction = clusterArray[i].direction;
    var lengthOfCluster = clusterArray[i].length;
    var elementsToPop = [];
    var elementsToReposition = [];
    var indexing = 1;
    if(direction == "V"){
      indexing = 10;
    }
    //for loop to push the elements needed to pop.
    for(var j = 0;j<lengthOfCluster;j++){
      elementsToPop.push((clusterArray[i].index)+(j*indexing));
    }//end for j
    //This part will decide which elements needed to be moved..
    ElementsToMove(clusterArray[i].index,clusterArray[i].direction,clusterArray[i].length,elementsToReposition);
    for(var k = 0;k<elementsToPop.length;k++){
      array[elementsToPop[k]].element = 6;
    }//End for k
    var firstElementToBeEmpty;
    var elementsToBeEmpty = [];
    //Give time to swap animation
    for(var l = (elementsToReposition.length)-1; l>=0;l--){
      var destination = elementsToReposition[l].moveTo;
      var home = elementsToReposition[l].id;
      array[destination].element = array[home].element;
      firstElementToBeEmpty = array[home].id;
    }
    if(elementsToReposition.length > 0){
      PushElementsToBeEmptiedIntoArray(firstElementToBeEmpty,elementsToBeEmpty,lengthOfCluster,indexing);
    }
    //Give time to animation
    setTimeout(function(){
      socket.emit("MoveElements",{elementsToReposition : elementsToReposition, elementsToPop : elementsToPop,gameArray : array});
    },200);
    EmptyElements(elementsToBeEmpty,array);
    //Here we are waiting for event from the animation function so we can redraw
    socket.on("RedrawAfterMoving",function(){
      socket.emit("Redraw",{array : array});
      //Give some time and then repopulate the elements in the emptied elements.
      setTimeout(function(){
        RepopulateTheElements(array);
        socket.emit("Redraw",{array : array});
      },500);
    });
  }//End counter i
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
  var offsetOfUndesiredElements = [0,-1,1,10,-10];
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
  console.log(elementsToEmpty[0]);
  for(var i = 0;i < elementsToEmpty.length;i++){
    gameArray[elementsToEmpty[i]].element = 6;
  }
}

//Helper function for PopElements to decide which elements needed to be moved after
//the popping of elements
function ElementsToMove(clusterIndex,direction,length,elementsToReposition){
  switch(direction){
    case "V":{
      var firstRow = CurrentColumn(clusterIndex);
      var numbersOfElements = (clusterIndex - firstRow)/10;
      for(var i = 0;i<numbersOfElements;i++){
        elementsToReposition.push(new MovableElement(firstRow+(10*i),length*10));
      }
      break;
    }//End case "V"
    case "H":{
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
