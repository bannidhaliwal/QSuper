
//This function will make connection to database.
//It will check if there is any query passed and
//if true than will pass the data to callback function.
var MySqlConnection = function(mySqlObject,queryArg,callback){
  //variable holds database information.
  //Variable will be used to make connection
  var connection = mySqlObject.createConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12165985',
  password : 'ghwJ6dEt8K',
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
module.exports.MySqlConnection = MySqlConnection;
