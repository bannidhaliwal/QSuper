//Modules for Server.js
//@author: Banni

//This function will receive the request and serve the
//page accordingly.
//Always Make sure the page names are lowercase. In
//directory as well.
var Router = function(request,response,server){
  var paths = {HomePage:"homepage",About:"about",PrivacyPolicy:"privacypolicy",GamePage:"gamepage"}; //Pages of Q-Super
  var URL = request.originalUrl; //get URl

  switch(sliceString(URL)){
    case paths["HomePage"]:{
      response.render(paths["HomePage"]+".ejs");
      break;
    }
    case paths["About"]:{
      response.render(paths["About"]+".ejs");
      break;
    }
    case paths["PrivacyPolicy"]:{
      response.render(paths["PrivacyPolicy"]+".ejs");
      break;
    }
    case paths["GamePage"]:{
      response.render(paths["GamePage"]+".ejs");
      break;
    }

    default:{
      response.render("notFound.ejs"); //If nothing matches, Redirect to notFound.ejs
      break;
    }
  }//End Switch
}//end Router
//Helper method of Router Function
function sliceString(string){
  string = string.slice(1);//Remove first letter which is /
  string = string.toLowerCase();
  return string;
}//End Slice String
module.exports.Router = Router;
