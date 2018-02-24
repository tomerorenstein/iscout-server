/**
 * Created by Tomer on 29-Jan-18.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'tomer',
    password : 'tomer',
    database : 'iscout'
});

connection.connect();

exports.db = connection;