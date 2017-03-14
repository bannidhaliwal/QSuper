//This file is the main entry point for
//Q-Super Project.
//@author: Banni
var express = require ('express');
var server = express();
var io = require('socket.io');
var bodyParser = require('body-parser');
var mySql = require('mysql');
var Routes = require('./lib/Routes.js');//Load the local modules.
var SQL = require('./lib/SQL.js');
var GameBox = require('./lib/GameClass.js');

var PORT = process.env.PORT || 8080; //Let heroku decide which port to choose.

server.set("view engine","ejs");
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: true })); //Not necessary ?
//Middleware for routing
server.use(function(req,res){
  Routes.Router(req,res,server,mySql);
});
//MySQL need to be pooled.
SQL.MySqlConnection(mySql);

// Socket.io
io = io.listen(server.listen(PORT));
io.sockets.on('connection', function (socket) {
    socket.emit("Hi");
    GameBox.CreateGameBox(function(a){socket.emit("Game Initialized",{array : a});});
});

console.log("This application is listening on " +PORT);
