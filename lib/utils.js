'use strict';

const Promise = require('bluebird');

exports.resolveDependency = (options, callback) => {

    return (server, next) => {

        callback(server, options).asCallback(next);
    };
};

exports.coHandler = (handler) => {

    return (request, reply) => {

        Promise.coroutine(handler)(request, reply)
            .catch((err) => reply(err));
    };
};
