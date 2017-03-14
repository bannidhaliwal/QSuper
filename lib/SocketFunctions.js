//Socket Events expects IO and GameBox Objects.
function SocketEvents(ioObject,GameBox){
  ioObject.sockets.on('connection', function (socket) {
      GameBox.CreateGameBox(function(arrayArg){
        socket.emit("Game Initialized",{array : arrayArg});
      }
    );
      socket.on("ClickedOnCanvas",function (data) {
        console.log("ClickedOnCanvas" +data.X +" "+data.Y );
      });
  });
}

module.exports.SocketEvents = SocketEvents;
