/*
  This file contains the function to make a connection to the 
  database and return the results. 
  @param mySqlObject : This is the instantiation of mysql library.
  @param queryArg : Query to run
  @param callback : callback function to run
*/
var MySqlConnection = function(mySqlObject,queryArg,callback){
  var connection = mySqlObject.createConnection({
  host     : 'sql12.freemysqlhosting.net',
  user     : 'sql12165985',
  password : 'ghwJ6dEt8K',
  port : 3306
  });
  var query = queryArg;
  connection.connect(function(err){
    if(err){
      console.log("Error in connecting to Database.");
    }
    else{
      console.log("Database Connected Successfully");
    }
  });
  //Choose database.
  connection.query("USE sql12165985;",function(err,results,field){
    if(err){
      console.log("Error in Query\n"+err);
    }
    //if not error and Query is defined, Make query to database.
    else{
      if(query !== undefined && typeof(query) === 'string'){ //if program wants to run a Query. Check if query is string.
        connection.query(query,function(err,results,field){
          if(err){
            callback(err,"error");
          }
          else{
            callback(results,"success");//run the callback
          }
        });//end connection.query
      }//end if(query !== "undefined")
    }//end else
    //End the connection.. we are not doing any error checking here..
    connection.end(function(err){});
  });//end outer connection query
}
module.exports.MySqlConnection = MySqlConnection;
