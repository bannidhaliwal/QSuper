//Modules for Server.js
//@author: Banni

//This function will receive the request and serve the
//page accordingly.
//Always Make sure the page names are lowercase (In
//directory as well)
var SQL = require('./SQL.js');
var Stats = require('./Calculations.js');
var session; //Global var for serving the session variables..
var Router = function(request,response,server,mySqlObject){

  var paths = ["homepage","about","privacypolicy","gamepage","login","register","contactus","calculator","calculations"]; //Pages of Q-Super
  var URL = request.originalUrl; //get URl
  if(request.method === "GET"){
    session = request.session;
    for(var i = 0;i < paths.length; i++){
      var rendered = false; //If page has been rendered.
      if(sliceString(URL) === paths[i]){//if we have requested page then render page
        response.render(paths[i],{session});
        rendered = true; //set rendered variable to true.
        break;
      }
    }//Refactor this code...
    //if we have a logout request
    if(sliceString(URL) === "logout"){
      request.session.reset();
      rendered = true;
      response.render("login.ejs",{session});
    }
    //If it is initial request then serve the homepage.
    if(sliceString(URL) === '/'){
      response.render(paths[0],{session});
      rendered = true;
    }
    if(!rendered){response.render("notFound",{session});} //If we dont have that page or user does not have priveleges to access that page.
  }//end if GET
  else if(request.method === "POST"){
    switch (sliceString(URL)) {
      case "login":{
        var userName = request.body.userName;
        var password = request.body.password;
        var query = 'SELECT * FROM `Users` where `email` = "'+userName+'" and `password` = "' +password+ '";';
        var mysqlConnection = SQL.MySqlConnection(mySqlObject,query,(results,flag)=>{
          if(results.length === 1){
            request.session.loggedIn = true;
            request.session.name = results[0].firstName;
            session = request.session;
            console.log("Home Page Rendered");
            response.render("homepage",{session});
          }
          else{
            session = request.session.loggedIn = false;
            response.render("notFound",{session});
          }
        });
        break;
      }//End case login.
      case "register":{
        var formData = {firstName:request.body.firstName,lastName:request.body.lastName,password:request.body.password,dob:request.body.dob,sex:"m",email:request.body.email};
        var query = 'INSERT INTO `Users`(`firstName`, `lastName`, `dob`, `sex`, `email`, `password`) VALUES ("'+formData.firstName+'","'+ formData.lastName + '",'+formData.dob+',"'+formData.sex+'","'+formData.email+'","'+formData.password+'");';
        var mySqlConnection = SQL.MySqlConnection(mySqlObject,query,(results,flag)=>{
          if(flag === "error"){

            console.log("Error has been encountered");
          }
          else{
            request.session.loggedIn = true;
            request.session.email = formData.email;
            request.session.name = formData.firstName;
            session = request.session;
            response.render("homepage",{session});
          }
        });
        break;
      }
      case "calculations":{
        var monthlySalary = parseInt(request.body.monthlysalary);
        var monthlySuperSacrifice = parseInt(request.body.monthlysuper);
        Stats.ReturnStats(monthlySalary,monthlySuperSacrifice,function(stats){
          response.render("calculations",{session,stats});
        });
        break;
      }
    }
  }//end if POST
}//end router
//Helper method of Router Function
function sliceString(string){
  if(string.length == 1){return string;}//this if statement checks if we have initial request string.
  string = string.slice(1);//Remove first letter which is '/'
  string = string.toLowerCase();
  return string;
}//End Slice String

// Helper method to route Pages.
function servePages(flags){
  //Necessary??
}

module.exports.Router = Router;
