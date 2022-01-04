var mysql = require('mysql');

var dbConn = mysql.createPool({
    host            : 'localhost',
    user            : 'mydev',
    password        : 'KunciKata1945+',
    database        : 'sobatku'
}); 

module.exports = dbConn;

// pindah komputer delete node_modules kemudian instaal ketik npm install cmd di folder copy an