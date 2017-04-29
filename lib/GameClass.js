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
  console.log(gameBoxArray);
  FindClustersHandler(gameBoxArray);
  console.log(gameBoxArray)
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
//Call this funciton instead of FindClusters itself
function FindClustersHandler(array){
  console.log("exe");
	for(var i = 1;i<9;i++){
  	var j = 1;
    var startingValue = parseInt(""+i+j);
    var endValue = startingValue+8;
   	FindClusters(array,startingValue,endValue,"H");
    startingValue = parseInt(""+1+i);
  	endValue = startingValue + 80;
    FindClusters(array,startingValue,endValue,"V");
  }
}//end FindClustersHandler

//This funciton will find cluster in the given array.
//Dont use this funciton directly instead use the FindClustersHandler
function FindClusters(array,startingValue,endValue,direction){
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
  for(var i = startingValue;i<endValue;i+=increasingValue){
  	var cluster = 1;
    for(var k = startingValue;k<endValue;k+=increasingValue){
    	if(k>i){
      	if(array[i].element === array[k].element){
        	cluster++;
        }//end if
        else {
        	//if we have a cluster of more then 2 elements than push to array
        	if(cluster>2){
          	clusters.push(new Cluster(i,cluster,direction,array[i].element));
          }
          //always jump to the new element. sometimes we can have two elements as cluster if we have a four element cluster.
        	i+=(cluster * increasingValue) - increasingValue;
        	break;
        }
      }//end if
    }//end K counter
  }//end i counter
  RemoveCluster(clusters,array);//Need to be passed as callback..
}//End FindClusters

//Remove clusters function. We will use this function to remove the clusters in the
//starting of game.

function RemoveCluster(clusterArray,array){
  var undesiredElements = [];
  console.log(clusterArray);
  if(clusterArray.length !== 0){
    for(var i = 0;i<clusterArray.length;i++){

      //For now this funciton is only removing the cluster of 3 elements and fail
      //to remove the clusters of 4 and more elements. Handle that.
      PushUndesiredElements(array,clusterArray[i].index,undesiredElements);
      PushUndesiredElements(array,clusterArray[i].index-1,undesiredElements);
      PushUndesiredElements(array,clusterArray[i].index+1,undesiredElements);
      PushUndesiredElements(array,clusterArray[i].index+10,undesiredElements);
      PushUndesiredElements(array,clusterArray[i].index-10,undesiredElements);
      array[clusterArray[i].index].element = AssignUniqueElementToRemoveTheCluster(undesiredElements);
    }
  }
}

//Function to assign the best unique element to the index to remove cluster
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

}

//Function to check if the id is valid and push the undesired element in the list.
function PushUndesiredElements(array,index,undesiredElementsArray){
  if(array[index] !== undefined){
    undesiredElementsArray.push(array[index].element);
  }
}


//we need methods like swapobjects. and we also have to check if the swap is legal.
//we also need the score trackers.
//integrity checkers if some player has manipulated the game data.
//some more helper methods.
module.exports.CreateGameBox = CreateGameBox;
