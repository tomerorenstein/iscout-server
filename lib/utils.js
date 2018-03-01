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

exports.sqlFunction = {
    equals: (value, column, isString) => {
        return isString ? (`LOWER(${column}) = '${value.toLowerCase()}'`) : (`${column} = ${value}`);
    },
    greater_or_equals: (value, column) => {
        return `${column} >= ${value}`;
    },
    smaller_or_equals: (value, column) => {
        return `${column} <= ${value}`;
    },
    contains: (value, column) => {
        return  `LOWER(${column}) LIKE '%${value.toLowerCase()}%'`;
    },
    in_range: (minValue, maxValue, column) => {
        return `${column} BETWEEN ${minValue} AND ${maxValue}`;
    }
};
