//Modules for Server.js
//@author: Banni

//This function will receive the request and serve the
//page accordingly.
//Always Make sure the page names are lowercase (In
//directory as well)
var Router = function(request,response,server,mySqlObject){
  var paths = {HomePage:"homepage",About:"about",PrivacyPolicy:"privacypolicy",GamePage:"gamepage",Login:"login",Register:"register",ContactUs:"contactus"}; //Pages of Q-Super
  var URL = request.originalUrl; //get URl
  if(request.method === "GET"){
    //remove the leading character before switching
    switch(sliceString(URL)){
      case paths["HomePage"]:{
        response.render(paths["HomePage"]);
        break;
      }
      case paths["About"]:{
        response.render(paths["About"]);
        break;
      }
      case paths["PrivacyPolicy"]:{
        response.render(paths["PrivacyPolicy"]);
        break;
      }
      case paths["GamePage"]:{
        response.render(paths["GamePage"]);
        break;
      }
      case paths["Login"]:{
        response.render(paths["Login"]);
        break;
      }
      case paths["Register"]:{
        response.render(paths["Register"]);
        break;
      }
      case paths["ContactUs"]:{
        response.render(paths["ContactUs"]);
        break;
      }

      case '/':{
        response.render(paths['HomePage']);
        break;
      }
      default:{
        response.render("notFound.ejs"); //If nothing matches, Redirect to notFound.ejs
        break;
      }
    }//End Switch
  }//end if GET
  else if(request.method === "POST"){
    switch (sliceString(URL)) {
      case "login":{
        response.send(request.body.name);
        MySqlConnection(mySqlObject,"Insert into Test VALUE (22,'"+request.body.name+"');",function(string){
          console.log(string)
        });
      }
    }
  }//end if POST
}//end router
//Helper method of Router Function
function sliceString(string){
  if(string.length == 1){return string;}
  string = string.slice(1);//Remove first letter which is '/'
  string = string.toLowerCase();
  return string;
}//End Slice String

//This function will make connection to database.
//It will check if there is any query passed and
//if true than will pass the data to callback function.
var MySqlConnection = function(mySqlObject,queryArg,callback){
  //variable holds database information.
  //Variable will be used to make connection
  var connection = mySqlObject.createConnection({
  host     : 'sql6.freemysqlhosting.net',
  user     : 'sql6162320',
  password : 'ByMtyULXNM',
  port : 3306
  });
  var query = queryArg;
  //connect to database.
  connection.connect(function(err){
    if(err){
      console.log("Error in connecting to Database.");
    }
    else{
      console.log("Database Connected Successfully");
    }
  });
  //Choose database.
  connection.query("USE sql6162320;",function(err,results,field){
    if(err){
      console.log("Error in Query\n"+err);
    }
    //if not error and Query is defined, Make query to database.
    else{
      if(query !== undefined && typeof(query) === 'string'){ //if program wants to run a Query. Check if query is string.
        connection.query(query,function(err,results,field){
          if(err){
            console.log(err);
          }
          else{
            callback(results);//run the callback
          }
        });//end connection.query
      }//end if(query !== "undefined")
    }//end else
  });//end outer connection query

  //Server drops the connection after some time
  //due to sitting idle. When connection send an error
  //We try to reconnect with recursive call.
  connection.on('error',function(){
    MySqlConnection(mySqlObject,queryArg,callback);
  });
}
module.exports.Router = Router;
module.exports.MySqlConnection = MySqlConnection;