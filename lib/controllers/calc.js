/**
 * Created by Tomer on 13-Nov-16.
 */
exports.add = function (request, reply) {
    reply(request.query.x + request.query.y);
};