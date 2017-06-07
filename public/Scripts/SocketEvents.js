/*
	This file will handle the events triggered by the
	server side for the client side.
	@author: Navjot Singh
*/
function SocketEventsForGamePage(){
	  /*
		This handler will be called on the event 
		of GameWon. It will swap the divs and 
		present the level clear screen.
	  */
      socket.on("GameWon",function(data){
        console.log("Game Ended");
        UpdateFinalStatsOfGame(data.levelData.score);
        SwapDivs("GameContent","SuperInformation");
      });
      /*
		This handler will be called when the game is
		lost. It will swap the div with the game lost 
		and try again window.
      */
      socket.on("GameLost",(data)=>{
        SwapDivs("GameContent","GameLost");
      });
      /*
		This handler will simply refresh the page.
		When the game is lost, we just refresh the 
		page and does not involve the server.
      */
      socket.on("RefreshPage",(data)=>{
        document.getElementById('refresh').click();
      });
      /*
		This handler will swap the two given elements
		on the canvas. Data is received from the server.
      */
      socket.on("SwapAnimation",function(data){
        SwapObjects(data,canvas,img);
      });

      /*
		Highlight the clicked element.
      */
      socket.on("Highlight",function(data){
        Highlight(data,canvas,img,"#33FFA5");
      });

      /*
		Dehighlight the clicked canvas
      */
      socket.on("Dehighlight",function(data){
        Highlight(data,canvas,img,"white");
      });

      /*
		This handler will be called when server emits
		that some elements need to be animated for moving 
		down.
      */
      socket.on("MoveElements",function(data){
        //Here we play the music after the tiles has been popped and before moving the tiles..
        PlayMusic();
        MoveElements(data,canvas,img);
      });

      /*
		When server sends the event of game initialized.
		The drawing function would use the data provided 
		by server and then draw the elements.
      */
      socket.on("Game Initialized",function(data){
        var array = data.array;
        var HEIGHT_OF_CANVAS = 400;
        var WIDTH_OF_CANVAS = 400;
        canvas.clearRect(0, 0, WIDTH_OF_CANVAS,HEIGHT_OF_CANVAS);//clear the canvas before redrawing..
        UpdateHTML(array);
        for(var i = 0; i < array.length;i++){
          if(array[i] !== null){
            //Here we are choosing element from array img on the base of element of current box.
            canvas.drawImage(img[array[i].element],array[i].xPosition,array[i].yPosition,array[i].height,array[i].width);
          }
        }//end For
      }
      );
      /*
		When game is played, server will respond with 
		Redraw event and we will use the data to redraw the
		game.
      */
      socket.on("Redraw",function(data){
        var array = data.array;
        var GAME_INFO_ARRAY = 11;
        var HEIGHT_OF_CANVAS = 400;
        var WIDTH_OF_CANVAS = 400;
        UpdateHTML(array);
        canvas.clearRect(0, 0, WIDTH_OF_CANVAS,HEIGHT_OF_CANVAS);//clear the canvas before redrawing..
        UpdateTheProgressBar(array[GAME_INFO_ARRAY]);
        document.getElementById("score").innerHTML = array[GAME_INFO_ARRAY].score;
        for(var i = 0; i < array.length;i++){
          if(array[i] !== null){
            //Here we are choosing element from array img on the base of element of current box.
            canvas.drawImage(img[array[i].element],array[i].xPosition,array[i].yPosition,array[i].height,array[i].width);
          }
        }//end For
      }
      );
}