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


exports.numberRandomize = function (min, max, isDouble) {

    if (!isDouble) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    } else {
        return Math.random() * (max - min) + min;
    }
};
