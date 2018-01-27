'use strict';

const Promise = require('bluebird');
const { resolveDependency } = require('../utils');

const register = Promise.coroutine(function*(server, options) {

    yield require('./list.js').routes(server, options);
});

exports.register = (server, options, next) => {

    server.dependency(['config'], resolveDependency(options, register));
    next();
};

exports.register.attributes = {
    name: 'route_example',
    version: '0.0.0'
};


