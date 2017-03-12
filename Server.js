//This file is the main entry point for
//Q-Super Project.
//@author: Banni
var express = require ('express');
var server = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8080; //Let heroku decide which port to choose.
var mySql = require('mysql');
var localModules = require('./lib/QSuperModules.js');//Load the local modules.
var GameBox = require('./lib/GameClass.js');
server.set("view engine","ejs");
server.use(express.static('public'));
server.use(bodyParser.urlencoded({ extended: true })); //Not necessary ??
//Middleware for routing
server.use(function(req,res){
  localModules.Router(req,res,server,mySql);
});
//MySQL need to be pooled.
localModules.MySqlConnection(mySql);
server.listen(PORT);
console.log("This application is listening on " +PORT);
