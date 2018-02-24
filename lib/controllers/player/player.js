/**
 * Created by Tomer on 13-Nov-16.
 */
let models = require('../../models');
let dbConn = models.db;

/**
 *
 * @param request
 * @param reply
 */
exports.register = async function (request, reply) {

    // Checks if username already exists
    // dbConn.query("SELECT 1 FROM 'users' WHERE username=?", request.payload.username, function (error, results, fields) {
    //     if (error) throw error;
    //     console.log('The solution is: ', results[0].solution);
    // });
    try {

        // Checks if username already exists
        let isUserExists =
            await dbConn.query("SELECT 1 FROM 'users' WHERE username=?", request.payload.username);

        if (isUserExists) {

            // if exists - send error - username already exists
            reply('error');
        } else {

            // Randomize player statistics

            // Saves to database

            // sends 200 code - ok

            reply(request.query.x + request.query.y);
        }
    } catch (err){
        reply(err);
    }
};