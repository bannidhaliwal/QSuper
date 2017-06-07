/*
	This function will add all the necessary event listeners 
	for the game page.
	@author:Navjot Singh
*/
function AddEventListenersForGamePage(){
  /*
	This event will emit the current coordinates 
	to the socket which will be transferred to the
	server side.
  */
  var canvasPlane = document.getElementById("canvas");
  canvasPlane.addEventListener('click',function() {
    var canvas = document.getElementById("canvas");
    var rectangleOnCanvas = canvas.getBoundingClientRect();
    var xCoord = Math.round(event.clientX - rectangleOnCanvas.left);
    var yCoord = Math.round(event.clientY - rectangleOnCanvas.top);
    socket.emit("ClickedOnCanvas",{X : xCoord, Y : yCoord});
  });
  /*
  	Add event listener to the input field
  */
  document.getElementById('superContribution').addEventListener('change',function(){
    setTimeout(UpdateOnKeyPress,30);
  });
  /*
    Add the event listeners to the scores. When we click 
    no super then we just emit the socket event with the 
    0 % contribution and if we click on the contributed 
    score then we emit the socket event with the value 
    from the user inputted value. Error checking will be 
    done on the server end. However, user will not be 
    prompted because error cannot be done unless intentional
    otherwise.
  */
  document.getElementById('totalScoreWithSuper').addEventListener('click',()=>{
    var contribution = document.getElementById("superContribution").value;
    contribution = parseInt(contribution);
    if(contribution < 0 || contribution > 30){
      contribution = 30;
    }
    setTimeout(()=>{
      socket.emit("SaveData",{contribution : contribution});
    },200);
  });
  document.getElementById('noSuperTotalScore').addEventListener('click',()=>{
    setTimeout(()=>{
      socket.emit("SaveData",{contribution : 0});
    },200);
    setTimeout(()=>{
      document.getElementById('refresh').click();
    },2000);
  });

  /*
	This listener will hide the game and show the tuts.
  */
  document.getElementById('gameTutorialButton').addEventListener('click',()=>{
    document.getElementById('GameContent').style.display = "none";
    document.getElementById('gameTutorial').style.display = "block";
  });
  /*
	This listener is for navigating through the tuts.
  */
  document.getElementById('nextTut').addEventListener('click',()=>{
    UpdateTut('next');
  });
  /*
	This listener is for navigating through the tuts.
  */
  document.getElementById('previousTut').addEventListener('click',()=>{
    UpdateTut('previous');
  });
  /*
	This listener will hide the tuts and show the game.
  */
  document.getElementById('backToGame').addEventListener('click',()=>{
    document.getElementById('GameContent').style.display = "block";
    document.getElementById('gameTutorial').style.display = "none";
  }); 
}