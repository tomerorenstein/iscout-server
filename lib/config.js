'use strict';

const _ = require('lodash');
const Path = require('path');
const { resolveDependency } = require('./utils');

/**
 * Turn an underscored key to a nested object
 * @param {string} underscoredKey Key to turn into nested object
 * @param {*} value The value of the lest key
 * @returns {object} Nested object
 */
const underscoreToNested = function (underscoredKey, value) {

    const res = {};
    let current = res;
    const keys = underscoredKey.split('_');
    const lastKey = keys.pop();
    keys.forEach((key) => {

        current[key] = {};
        current = current[key];
    });
    current[lastKey] = value;
    return res;
};

//$lab:coverage:off$
const config = {
    port: process.env.PORT || 3000,
};

if (process.env.NODE_ENV !== 'production') {
    config.isLocal = true;
    config.isTesting = process.env.NODE_ENV === 'test';
    config.hostname = `127.0.0.1:${config.port}`;
}
//$lab:coverage:on$

Object.keys(config).forEach((key) => {

    exports[key] = config[key];
});

exports.register = (server, options, next) => {

    Object.keys(config).forEach((key) => server.expose(key, config[key]));
    next();
};

exports.register.attributes = {
    name: 'config',
    version: '0.0.0'
};
