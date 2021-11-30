const mysql = require('mysql');

/* MOCK */
// const dbConn = mysql.createConnection({
//     host        : 'localhost',
//     user        : 'root',
//     password    : '',
//     database    : 'sobatku'
// });

/* LIVE */
const dbConn = mysql.createConnection({
    host        : 'localhost',
    user        : 'mydev',
    password    : 'KunciKata1945+',
    database    : 'sobatku'
});

dbConn.connect(function(err) {
    if(err) throw err;
    console.log("Database Connected!");
})

module.exports = dbConn;