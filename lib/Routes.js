var SQL = require("./SQL.js")
/*
  This library is for serving the POST and GET requests
  from the users. 
  @author: Navjot Singh Dhaliwal
*/
var Router = function(request,response,SqlAndGameElements){
  var URL = request.originalUrl;
  var session = request.session;
  var AllElements = {Request:request,Response:response,Request:request,SqlAndGameElements:SqlAndGameElements,URL:URL,Session:session};
  if(request.method === "GET"){
    DeterminePageRequestAndResponseAccordingly_GET(AllElements);
  }//end if GET
  else if(request.method === "POST"){
    console.log('Post Request');
    DeterminePageRequestAndResponseAccordingly_POST(AllElements);
  }
}//end router

/*
  This function is for handling all the POST requests. 
  @AllElements: Variable that contains the sql, response and request 
                objects.
*/
function DeterminePageRequestAndResponseAccordingly_POST(AllElements){
  var URL = SliceString(AllElements.URL);
  var MySql = AllElements.SqlAndGameElements.MySql;
  var session = AllElements.Session;
  switch(URL){
      case "login":{
        var userName = AllElements.Request.body.userName;
        var password = AllElements.Request.body.password;
        var query = 'SELECT * FROM `Users` where `email` = "'+userName+'" and `password` = "' +password+ '";';
        var mysqlConnection = SQL.MySqlConnection(MySql,query,(results,flag)=>{
          if(results.length === 1){
            LoginTheUser(session,results[0]);
            console.log("Home Page Rendered");
            AllElements.Response.render("homepage",{session});
          }
          else{
            SetErrorOnUserNotFound(session,"Check Username and Password");
            AllElements.Response.render("login",{session});
          }
        });
        break;
      }//End case login.
      case "register":{
        var formData = {firstName:AllElements.Request.body.firstName,lastName:AllElements.Request.body.lastName,phoneNumber:AllElements.Request.body.phoneNumber,password:AllElements.Request.body.password,dob:AllElements.Request.body.dob,sex:"m",email:AllElements.Request.body.email};
        var typesOfData = ["NAME","LAST_NAME","PHONE_NUMBER","PASSWORD","DOB","GENDER","EMAIL"];
        var counterOfTypesOfData = 0;
        var invalidData = [];
        DestroySession(session);
        for(var i in formData){
          if(DataValid(formData[i],typesOfData[counterOfTypesOfData]) == false){
            console.log("data false");
            SetSessionForInvalidDataInRegistrationForm(session,typesOfData[counterOfTypesOfData]);
          }
          counterOfTypesOfData++;
        }//end counter i
        var userName = formData.email;
        var query = 'SELECT * FROM `Users` where `email` = "'+userName+'";';
        var mysqlConnection = SQL.MySqlConnection(MySql,query,(results,flag)=>{
          if(results.length == 1){
              SetSessionForInvalidDataInRegistrationForm(session,"EMAIL");
              AllElements.Response.render("register",{session,formData});
          }
          else if(session.error){
              AllElements.Response.render("register",{session,formData});
          }
          else {
            var query = 'INSERT INTO `Users`(`firstName`, `lastName`, `dob`,`email`, `password`,`super`,`level`,`score`,`scoreWithoutSuper`) VALUES ("'+formData.firstName+'","'+ formData.lastName + '","'+formData.dob+'","'+formData.email+'","'+formData.password+'",0,1,0,0);';
            var mySqlConnection = SQL.MySqlConnection(MySql,query,(results,flag)=>{
              if(flag === "error"){
                console.log(flag);
                console.log(results);
                Allelements.Response.render("notFound",{session});
              }
              else{
                RegisterAndLoginTheUser(session,formData);
                AllElements.Response.render("homepage",{session});
                  }
                });
          }
        });//End mySqlConnection.
      }
  }
}
/*
  This function will set the session to error mode if the registration
  inputs have any invalid data.
  @param session: Session variable
  @param typeOfData: Type of data which is invalid
*/
function SetSessionForInvalidDataInRegistrationForm(session,typeOfData){
  session.error = true;
  if(!session.errorForms){
    session.errorForms = [];
  }
  session.errorForms.push(typeOfData);
}
/*
  This function login the user if the registraion was successfull.
  @param session: Session variable
  @param data: Data which was used to log in the user.
*/
function RegisterAndLoginTheUser(session,data){
  session.destroy();
  session.loggedIn = true;
  session.email = data.email;
  session.name = data.firstName;
  session.level = 1;
}

/*
  Helper method to login the user.
  @param session: Session Varibale
  @param data: Data received from the SQL query.
*/
function LoginTheUser(session,data){
  session.destroy();
  session.loggedIn = true;
  session.name = data.firstName;
  session.email = data.email;
  session.level = data.level;
  session.super = data.super;
}
/*
  Helper method to set the necessary flags if the user
  is not found..
*/
function SetErrorOnUserNotFound(session,errorMessage){
  session.error = true;
  session.errorMessage = errorMessage;
  session.loggedIn = false;
}
/*
  This function simply destroy the session.
  @param session: Session Variable
*/
function DestroySession(session){
  session.destroy();
}
/*
  This function is for GET request. Here we have an array which contains the 
  pages that do not required to redirected on the basis of user's logged in 
  status or we dont need to modify the session variable.
  If the requested page is not in the array, then we will check if 
  the request was for Register, login, logout, GamePage or it was initial
  request which is "/". If none match was found then we will render the default
  case which is notfound.ejs
  @param AllElements: This parameter contains all the required elements for the 
                      Game and website initialization.
*/
function DeterminePageRequestAndResponseAccordingly_GET(AllElements){
  var session = AllElements.Session;
  var SocketEventsObject = AllElements.SqlAndGameElements.SocketEvents;
  var Io = AllElements.SqlAndGameElements.Io;
  var GameBoxObject = AllElements.SqlAndGameElements.GameBox;
  var paths = ["homepage","about","privacypolicy","contactus","calculator"];
  var URL = SliceString(AllElements.URL);
  for(var i = 0;i < paths.length; i++){
    if(SliceString(AllElements.URL) === paths[i]){
      AllElements.Response.render(paths[i],{session});
      return;
    }
  }//end for
  switch(URL){
    case "register":{
      if(session.loggedIn == true){
        AllElements.Response.render('homepage',{session});
        }//end if
        else{
          AllElements.Response.render('register',{session});
        }//end else
      break;
    }//end case register

    case "login":{
      if(session.loggedIn == true){
        AllElements.Response.render('homepage',{session});
        }//end if
        else{
          DestroySession(session);
          AllElements.Response.render('login',{session});
        }//end else
      break;
    }//end case login

    case "logout":{
      DestroySession(session);
      AllElements.Response.render("login.ejs",{session});
      break;
    }//end case logout

    case "gamepage":{
      SocketEventsObject.SocketEvents(Io,GameBoxObject,session); //pass IO object and GameBox Object.
      AllElements.Response.render("gamepage.ejs",{session});
      break;
    }//end case gamepage

    case "/":{
      AllElements.Response.render(paths[0],{session});
      break;
    }//end case /

    default:{
      AllElements.Response.render("notFound",{session});
      break;
    }//end default
  }//end switch URL
}

/*
  Helper method to sanitize the user input in the registraion form.
  @param string: String to sanitize.
  @param type: Type of the string. For example: NAME
*/
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

/*
  Helper method to remove the starting "/" of the string.
  This method is for the serving user requests.
  @param string: String to modify
*/
function SliceString(string){
  if(string.length == 1){return string;}//this if statement checks if we have initial request string.
  string = string.slice(1);//Remove first letter which is '/'
  string = string.toLowerCase();
  return string;
}//End Slice String
module.exports.Router = Router;
