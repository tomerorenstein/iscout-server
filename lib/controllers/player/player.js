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

    try {

        // Checks if username already exists
        let [isUserExists] =
            await dbConn("SELECT 1 FROM USERS WHERE username=?", [request.payload.username]);

        if (isUserExists) {

            // if exists - send error - username already exists
            reply(models.Boom.conflict('username already exists'));
        } else {

            // Randomize player statistics

            // Saves to database

            // sends 200 code - ok
            //throw new Error('fail');
            //reply(request.query.x + request.query.y);
        }
    } catch (err){
        reply(err);
    }
};