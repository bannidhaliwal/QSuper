//Require Socket.io for real time synchornisation
//Require ejs for templating
//Require express for serving files
var PORT = process.env.PORT || 8080;
var express = require ('express');
var server = express();

server.set("view engine","ejs");

server.get('/',function(req,res){
  res.render('test.ejs');
});

server.listen(PORT);
console.log("This application is listening on " +PORT);
