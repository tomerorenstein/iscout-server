/**
 * Created by Tomer on 27-Jan-18.
 */
const models = require('../../models');
const utils = require('../../utils');
const scouterDAL = require('./scouterDAL');
const iscountconf = require('../../config').iscout;
const _ = require('underscore');
const async = require('async');
const dbConn = models.dbConn;

/**
 * Gets scouter's info
 * @param scouterId
 * @param cb - callback
 */
const getScouterInfo = function (scouterId, cb) {

    // Gets current scouter basic info
    scouterDAL.getScouterInfo(scouterId, function (err, results) {

        if (err){
            cb(err);
        } else {

            // Returns player's basic info
            let resJson = {
                name: results[0].name,
                country: results[0].country,
                team: results[0].club
            };

            // Invokes callback with result data
            cb(null, resJson);
        }
    });
};

/**
 * This function registers new scout to IScout app
 * @param request
 * @param reply
 */
exports.register = function (request, reply) {

    // Checks if username already exists
    dbConn.query("SELECT 1 as isUsernameExists FROM users WHERE username=?",
        [request.payload.username], function (err, results) {

            if (err){
                reply(models.Boom.badImplementation(err));
            } else {

                // Gets the result
                let isUsernameExists = (results.length !== 0);

                if (isUsernameExists) {

                    // if exists - send error - username already exists
                    reply(models.Boom.conflict('username already exists'));
                } else {

                    // Saves to database - one transaction
                    dbConn.beginTransaction(function(err) {

                        if (err){
                            reply(models.Boom.badImplementation(err));
                        } else {

                            // Inserts new user to users table - gets user id
                            // Inserts new player basic info - gets player id
                            dbConn.query(`INSERT INTO users 
                                         (username, password, type) 
                                         VALUES (?, ?, 2); 
                                         INSERT INTO scouters_info 
                                         (name, club, country) 
                                         VALUES (?, ?, ?)`,
                                         [request.payload.username, request.payload.password,
                                          request.payload.name, request.payload.team,
                                          request.payload.country], function(err, results){

                                    if (err) {
                                        dbConn.rollback(function () {
                                            reply(models.Boom.badImplementation(err));
                                        });
                                    } else {

                                        let userid = results[0].insertId;
                                        let scouterid = results[1].insertId;

                                        // Inserts new user and scouter to users_to_scouters_rel table
                                        dbConn.query(`INSERT INTO users_to_scouters_rel 
                                                     (user_id, scouter_id) 
                                                     VALUES (?, ?)`,
                                                     [userid, scouterid], function (err, results) {
                                                if (err){
                                                    dbConn.rollback(function () {
                                                        reply(models.Boom.badImplementation(err));
                                                    });
                                                } else {

                                                    // Commit
                                                    dbConn.commit(function (err) {

                                                        if (err){
                                                            dbConn.rollback(function () {
                                                                reply(models.Boom.badImplementation(err));
                                                            });
                                                        } else {
                                                            // sends 201 code - created
                                                            reply().code(201);
                                                        }
                                                    });
                                                }
                                            });
                                    }
                                });
                        }
                    });
                }
            }
        });
};

/**
 * This function handles scouters login
 * @param request
 * @param reply
 */
exports.login = function (request, reply) {

    // Checks if username and password exists
    dbConn.query("SELECT id as user_id FROM users WHERE username=? and password=? and type=2",
        [request.query.username, request.query.password], function (err, res) {

            if (err){
                reply(models.Boom.badImplementation(err));
            } else {

                // Gets the result
                let isUserExists = (res.length !== 0);

                if (isUserExists) {

                    // Gets current player basic info
                    dbConn.query(`SELECT id, name, club, country 
                                  FROM scouters_info as si
                                  WHERE si.id = 
                                    (SELECT rel.scouter_id 
                                     FROM users_to_scouters_rel as rel 
                                     WHERE rel.user_id = ?)`,
                        [res[0].user_id], function (err, results) {

                            if (err){
                                reply(models.Boom.badImplementation(err));
                            } else {

                                // Returns player's basic info
                                let resJson = {
                                    user_id: res[0].user_id,
                                    scouter_id: results[0].id,
                                    name: results[0].name,
                                    country: results[0].country,
                                    team: results[0].club
                                };
                                reply(resJson).code(200)
                            }
                        });
                } else {

                    // Wrong username or password
                    reply(models.Boom.unauthorized('Wrong username or password'));
                }
            }
        });
};

/**
 * This function searches scouters by name, country, team
 * @param request
 * @param reply - Array of - { name, team, country }
 */
exports.search = function (request, reply) {

    // Sets alias for socoutersInfo DB table
    const alias = 'si';

    // Gets scouter info parameters sql array - filled with value
    let scouterInfoParamsSqlArr =

        // Checks if query contains current parameter - for knowing whether to ignore current param or not
        _.filter(Object.keys(scouterDAL.scouter_info_params_to_SQL), (param) => {
            return (Object.prototype.hasOwnProperty.call(request.query, param));
        }).map((param) => {
            return scouterDAL.scouter_info_params_to_SQL[param](request.query[param], alias);
        });

    // Searches scouters matching current search
    scouterDAL.search(scouterInfoParamsSqlArr, alias, function (err, results) {

        if (err){
            reply(models.Boom.badImplementation(err));
        } else {

            // Gets search matched scouters' ids
            let scouterIds = _.map(results, (res) => { return res.scouter_id; } );

            // Gets full data of each player and sends to client
            async.map(scouterIds, (id, cb) => {
                getScouterInfo(id, cb);
            }, (err, data) => {

                if (err) {
                    reply(models.Boom.badImplementation(err));
                } else {

                    // Returns objects
                    reply(data).code(200);
                }
            });
        }
    });
};