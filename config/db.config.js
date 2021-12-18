var mysql = require('mysql');

var dbConn = mysql.createPool({
    host            : 'localhost',
    user            : 'mydev',
    password        : 'KunciKata1945+',
    database        : 'sobatku'
}); 

module.exports = dbConn;
