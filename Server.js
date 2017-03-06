//This file is the main entry point for
//Q_Super Project.
//@author: Banni
var express = require ('express');
var server = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8080;
var mySql = require('mysql');
var localModules = require('./QSuperModules.js');
server.set("view engine","ejs");

server.use(bodyParser.urlencoded({ extended: true }));
//Middleware for routing
server.use(function(req,res){
  localModules.Router(req,res,server,mySql);
});
localModules.MySqlConnection(mySql);

server.listen(PORT);
console.log("This application is listening on " +PORT);
