/**
 * Created by Tomer on 29-Jan-18.
 */
const mysql = require('mysql');
const util = require('util');
require('util.promisify').shim();

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'tomer',
    password : 'tomer',
    database : 'iscout'
});

connection.connect();
const query = util.promisify(connection.query).bind(connection);
exports.db = query;

const Boom = require('boom');
exports.Boom = Boom;