/**
 * Created by Tomer on 01-Mar-18.
 */
const sqlFunction = require('../../utils').sqlFunction;
const config = require('../../config');
const models = require('../../models');
const dbConn = models.dbConn;
const _ = require('underscore');

/**
 * Query scouter's info by scouterid
 * @param scouterid
 * @param cb
 */
exports.getScouterInfo = function (scouterid, cb) {

    // Gets current player basic info
    dbConn.query(`SELECT name, country, club  
                  FROM scouters_info 
                  WHERE id = ?`, [scouterid], cb);
};

/**
 * Query scouters by wanted params
 * @param sqlArr
 * @param scouterInfoAlias - scoutersInfo DB table alias
 * @param cb
 */
exports.search = function (sqlArr, scouterInfoAlias, cb) {

    // Creates basic query
    let query = `SELECT ${scouterInfoAlias}.id as scouter_id
                 FROM scouters_info as ${scouterInfoAlias} `;

    // Creates WHERE clause
    let whereClause = (sqlArr.length === 0) ? '' :
        _.reduce(sqlArr, function(accumulator, currentItem) {
            return accumulator + ' ' + currentItem + ' AND';
        }, 'WHERE').slice(0, -4);

    // Runs query
    dbConn.query(query + whereClause, [], cb);
};

/**
 * json of functions for each scouter info parameter - matched sql
 * value - the value of the parameter to search for
 * alias - the parameter's table alias name
 */
exports.scouter_info_params_to_SQL = {
    name: (value, alias) => {
        return sqlFunction.contains(value, alias + '.' + 'name');
    },
    country: (value, alias) => {
        return sqlFunction.equals(value, alias + '.' + 'country', true);
    },
    team: (value, alias) => {
        return sqlFunction.equals(value, alias + '.' + 'club', true);
    }
};