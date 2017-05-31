/*
	This file is the server and the main entry for the 
	Q-Super project. 
	@author : Navjot Singh Dhaliwal
*/
var express = require ('express');
var server = express();
var io = require('socket.io');
var bodyParser = require('body-parser');
var mySql = require('mysql');
var Routes = require('./lib/Routes.js');
var GameBox = require('./lib/GameClass.js');
var socketEvents = require('./lib/SocketFunctions.js');
var session = require('client-sessions');
var PORT = process.env.PORT || 8080; 
server.set("view engine","ejs");
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(session({
  cookieName: 'session',
  secret: 'this_is_a_random_string',
}));
io = io.listen(server.listen(PORT));
/*
	This is our middleware for routing. Here we pass all the 
	necessry elements to the Router Library..
*/
server.use(function(request,response){
  Routes.Router(request,response,server,mySql,io,socketEvents,GameBox);
});
console.log("This application is listening on " +PORT);
