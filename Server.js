//This file is the main entry point for
//Q-Super Project.
//@author: Banni Singh Dhaliwal
var express = require ('express');
var server = express();
var io = require('socket.io');
var bodyParser = require('body-parser');
var mySql = require('mysql');
var Routes = require('./lib/Routes.js');//Load the local modules.
var GameBox = require('./lib/GameClass.js');
var socketEvents = require('./lib/SocketFunctions.js'); //socket events.
var session = require('client-sessions');
var PORT = process.env.PORT || 8080; //Let heroku decide which port to choose.
server.set("view engine","ejs");
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: true })); //Not necessary ?
//Use of the sessions. It is still under devlopment.
server.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));
//Middleware for routing
server.use(function(req,res){
  Routes.Router(req,res,server,mySql);
});
// Socket.io
io = io.listen(server.listen(PORT));
socketEvents.SocketEvents(io,GameBox); //pass IO object and GameBox Object.
console.log("This application is listening on " +PORT);
