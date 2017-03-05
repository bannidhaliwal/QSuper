//This file is the main entry point for
//Q_Super Project.
//@author: Banni
var express = require ('express');
var server = express();
var PORT = process.env.PORT || 8080;
var routes = require('./QSuperModules.js');
server.set("view engine","ejs");
//Middleware for routing
server.use(function(req,res){
  routes.Router(req,res,server);
});

server.listen(PORT);
console.log("This application is listening on " +PORT);
