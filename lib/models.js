/**
 * Created by Tomer on 29-Jan-18.
 */
const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'tomer',
    password : 'tomer',
    database : 'iscout',
    multipleStatements: true
});

connection.connect(function(state){
    console.log('connected to db')
});

exports.dbConn = connection;

const Boom = require('boom');
exports.Boom = Boom;