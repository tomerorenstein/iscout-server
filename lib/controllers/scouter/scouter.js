/**
 * Created by Tomer on 27-Jan-18.
 */
const models = require('../../models');
const utils = require('../../utils');
const iscountconf = require('../../config').iscout;
const dbConn = models.dbConn;

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