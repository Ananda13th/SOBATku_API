var mysql = require('mysql');

var dbConn = mysql.createPool({
    host            : 'localhost',
    user            : 'mydev',
    password        : 'KunciKata1945+',
    database        : 'sobatku'
}); 

/* METHOD 2 */


// var db_config = {
//   host        : 'localhost',
//     user        : 'mydev',
//     password    : 'KunciKata1945+',
//     database    : 'sobatku'
// };

// //- Create the connection variable
// var dbConn = mysql.createConnection(db_config);

// //- Establish a new connection
// dbConn.connect(function(err){
//   if(err) {
//       // mysqlErrorHandling(connection, err);
//       console.log("\n\t *** Cannot establish a connection with the database. ***");

//       dbConn = reconnect(dbConn);
//   }else {
//       console.log("\n\t *** New connection established with the database. ***")
//   }
// });

// //- Reconnection function
// function reconnect(dbConn){
//   console.log("\n New connection tentative...");

//   //- Destroy the current connection variable
//   if(dbConn) dbConn.destroy();

//   //- Create a new one
//   var dbConn = mysql.createConnection(db_config);

//   //- Try to reconnect
//   dbConn.connect(function(err){
//       if(err) {
//           //- Try to connect every 2 seconds.
//           setTimeout(reconnect, 2000);
//       }else {
//           console.log("\n\t *** New connection established with the database. ***")
//           return dbConn;
//       }
//   });
// }

// //- Error listener
// dbConn.on('error', function(err) {

//   //- The server close the connection.
//   if(err.code === "PROTOCOL_CONNECTION_LOST"){    
//       console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//       dbConn = reconnect(dbConn);
//   }

//   //- Connection in closing
//   else if(err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT"){
//       console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//       dbConn = reconnect(dbConn);
//   }

//   //- Fatal error : connection variable must be recreated
//   else if(err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"){
//       console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//       dbConn = reconnect(dbConn);
//   }

//   //- Error because a connection is already being established
//   else if(err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE"){
//       console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//   }

//   //- Anything else
//   else{
//       console.log("/!\\ Cannot establish a connection with the database. /!\\ ("+err.code+")");
//       dbConn = reconnect(dbConn);
//   }

// });

module.exports = dbConn;
