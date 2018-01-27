/**
 * Created by Tomer on 13-Nov-16.
 */
exports.register = function (request, reply) {

    // Checks if username already exists

        // if exists - send error - username already exists
        reply('error');

    // Randomize player statistics

    // Saves to database

    // sends 200 code - ok

    reply(request.query.x + request.query.y);
};