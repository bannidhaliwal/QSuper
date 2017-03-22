//Modules for Server.js
//@author: Banni

//This function will receive the request and serve the
//page accordingly.
//Always Make sure the page names are lowercase (In
//directory as well)
var Router = function(request,response,server,mySqlObject){

  var paths = ["homepage","about","privacypolicy","gamepage","login","register","contactus"]; //Pages of Q-Super

  var URL = request.originalUrl; //get URl
  if(request.method === "GET"){
    for(var i = 0;i < paths.length; i++){
      var rendered = false; //If page has been rendered.
      if(sliceString(URL) === paths[i]){//if we have requested page then render page
        response.render(paths[i]);
        rendered = true; //set rendered variable to true.
        break;
      }
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
  if(string.length == 1){return string;}//this if statement checs if we have initial request string.
  string = string.slice(1);//Remove first letter which is '/'
  string = string.toLowerCase();
  return string;
}//End Slice String

module.exports.Router = Router;
