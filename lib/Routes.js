//Modules for Server.js
//@author: Banni

//This function will receive the request and serve the
//page accordingly.
//Always Make sure the page names are lowercase (In
//directory as well)
var SQL = require('./SQL.js');
var session; //Global var for serving the session variables..
var Router = function(request,response,server,mySqlObject,io,socketEventsObject,gameBoxObject){
  var paths = ["homepage","about","privacypolicy","contactus","calculator"]; //Pages of Q-Super
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
    }
    if(sliceString(URL) === "register"){
      if(session.loggedIn == true){
        response.render('homepage',{session});
        rendered = true; //set rendered variable to true.
      }
      else{
        response.render('register',{session});
        rendered = true; //set rendered variable to true.
      }
    }

    if(sliceString(URL) === "login"){
      if(session.loggedIn == true){
        response.render('homepage',{session});
        rendered = true; //set rendered variable to true.
      }
      else{
        response.render('login',{session});
        rendered = true; //set rendered variable to true.
      }
    }
    //if we have a logout request
    if(sliceString(URL) === "logout"){
      request.session.reset();
      rendered = true;
      response.render("login.ejs",{session});
    }
    //If the request if game page then we have to initialize the game.
    if(sliceString(URL) === "gamepage"){
      // Socket.io
      socketEventsObject.SocketEvents(io,gameBoxObject,session); //pass IO object and GameBox Object.
      rendered = true;
      response.render("gamepage.ejs",{session});
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
            request.session.reset();
            request.session.loggedIn = true;
            request.session.name = results[0].firstName;
            request.session.email = results[0].email;
            request.session.level = results[0].level;
            request.session.super = results[0].super;
            session = request.session;
            console.log("Home Page Rendered");
            response.render("homepage",{session});
          }
          else{
            request.session.error = true;
            request.session.errorMessage = "User not Found!"
            request.session.loggedIn = false;
            session = request.session;
            response.render("login",{session});
          }
        });
        break;
      }//End case login.

      //DONT LOOK DOWN.. HORRIFIC CODE..
      //This code is messy. I will try to explain here. Here we first get the
      //details from the client side and store them into the formData variable.
      //Then we have another array which records the type of each member of formData
      //in correspondence to its index. Then we reset the session data as we need
      //to disable the error flag and the array of error forms in session variable.
      //After that we check if we have any error in the formData and then we return
      //it to client side if we have any error. After that we will check if we have
      //the email id in use. if everything is okay, then we create entry in database and
      //on success we log the user in..
      case "register":{
        var formData = {firstName:request.body.firstName,lastName:request.body.lastName,phoneNumber:request.body.phoneNumber,password:request.body.password,dob:request.body.dob,sex:"m",email:request.body.email};
        //Sanitize the user data
        var typesOfData = ["NAME","LAST_NAME","PHONE_NUMBER","PASSWORD","DOB","GENDER","EMAIL"];
        var counterOfTypesOfData = 0;
        var invalidData = [];
        request.session.reset();
        request.session.errorForms = [];
        for(var i in formData){
          if(DataValid(formData[i],typesOfData[counterOfTypesOfData]) == false){
            console.log("data false");
            request.session.errorForms.push(typesOfData[counterOfTypesOfData]);
            request.session.error = true;
          }
          counterOfTypesOfData++;
        }//end counter i

        //Check if user name is already taken..
        var userName = request.body.email;
        var query = 'SELECT * FROM `Users` where `email` = "'+userName+'";';
        var mysqlConnection = SQL.MySqlConnection(mySqlObject,query,(results,flag)=>{
          //if user name has been taken then render the page again with error..
          if(results.length === 1){
              request.session.error = true;
              request.session.errorForms.push("EMAIL");
              session = request.session;
              console.log("email exist");
              response.render("register",{session,formData});
          }
          //otherwise check if there is any form that contained error..
          else{
            //If there was an error in any field than we need to rerender the registration page.
            if(request.session.error == true){
              session = request.session;
              response.render("register",{session,formData});
            }
            //otherwise just insert the query into the database..
            else{
                request.session.error = false;
                var query = 'INSERT INTO `Users`(`firstName`, `lastName`, `dob`,`email`, `password`,`super`,`level`,`score`,`scoreWithoutSuper`) VALUES ("'+formData.firstName+'","'+ formData.lastName + '","'+formData.dob+'","'+formData.email+'","'+formData.password+'",0,1,0,0);';
                var mySqlConnection = SQL.MySqlConnection(mySqlObject,query,(results,flag)=>{
                  if(flag === "error"){
                    console.log(flag);
                    console.log(results);
                    response.render("notFound",{session});
                  }
                  else{
                    request.session.reset();
                    request.session.loggedIn = true;
                    request.session.email = formData.email;
                    request.session.name = formData.firstName;
                    request.session.level = 1;
                    session = request.session;
                    response.render("homepage",{session});
                  }
                });
            }//end else
          }
        });
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

//Helper method to check and sanitize the user inputs from the forms
function DataValid(string,type){
  switch(type){
    case "NAME":{
      var valid = /^[A-Za-z\s]+$/.test(string);
      return valid;
    }//End case "NAME"

    case "LAST_NAME":{
      var valid = /^[A-Za-z\s]+$/.test(string);
      return valid;
    }//End case "LAST_NAME"

    case "EMAIL":{
      var valid  = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(string);
      return valid;
    }//End case "EMAIL"

    case "PHONE_NUMBER":{
      var valid = /^0[0-8]\d{8}$/g.test(string);
      return valid;
    }//end case "PHONE_NUMBER"

    case "DOB":{
      var valid =/^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/.test(string);
      return valid;
    }//end case "DOB"

    case "GENDER":{
      var valid = string == "m" | string == "f";
      if(valid === 1){return true;}else{return false;}
    }//end case "GENDER"

    case "PASSWORD":{
      var valid = true;
      if(string.length < 6){valid = false;}
      return valid;
    }//end case "PASSWORD"
  }//end switch

}//end function DataValid

module.exports.Router = Router;
