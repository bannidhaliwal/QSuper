//Modules for Server.js
//@author: Banni

//This function will receive the request and serve the
//page accordingly.
//Always Make sure the page names are lowercase (In
//directory as well)

// we dont have a working database so we need the hardcoded username and password
var hardCodedUserName = "Banni";
var hardCodedPassword = "Dhaliwal";
var Router = function(request,response,server,mySqlObject){
  var paths = ["homepage","about","privacypolicy","gamepage","login","register","contactus"]; //Pages of Q-Super
  var URL = request.originalUrl; //get URl
  if(request.method === "GET"){
    var loggedIn = request.session.loggedIn;
    for(var i = 0;i < paths.length; i++){
      var rendered = false; //If page has been rendered.
      if(sliceString(URL) === paths[i]){//if we have requested page then render page
        response.render(paths[i],{loggedIn});
        rendered = true; //set rendered variable to true.
        break;
      }
    }//Refactor this code...
    if(sliceString(URL) === "logout"){
      request.session.reset();
      rendered = true;
      response.render("login.ejs");
    }
    //If it is initial request.
    if(sliceString(URL) === '/'){
      response.render(paths[0]);
      rendered = true;
    }
    if(!rendered){response.render("notFound");} //If we dont have that page or user does not have priveleges to access that page.
  }//end if GET
  else if(request.method === "POST"){
    switch (sliceString(URL)) {
      case "login":{
        var userName = request.body.userName;
        var password = request.body.password;
        if(request.body.userName === hardCodedUserName && request.body.password === hardCodedPassword){
          request.session.email = userName;
          request.session.loggedIn = true;
          response.render("homepage",{loggedIn:true});
        }
        else{
          response.render("notFound")
        }
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
