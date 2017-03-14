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

module.exports.Router = Router;
