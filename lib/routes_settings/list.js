'use strict';

const Joi = require('joi');
const { coHandler } = require('../utils');
const Promise = require('bluebird');
const calc = require('../controllers/calc');

exports.routes = Promise.coroutine(function*(server, options) {

    let routesArray = [
        {
            method: 'GET',
            path: options.prefix + '/add',
            config: {
                tags: ['api'],
                handler: calc.add,
                validate: {
                    query: {
                        x: Joi.number(),
                        y: Joi.number()
                    }
                }
            }
        }
    ];

    server.route(routesArray);
});

//
// server.route({
//     method: 'GET',
//     path: options.prefix,
//     config: {
//         tags: ['api', 'v1', 'route_example'],
//         description: 'List example items',
//         validate: {
//             query: {
//                 query_param_example: Joi.string().description('Example of a query param')
//             }
//         },
//         response: {
//             schema: Joi.object({
//             }).label('Example Response Object')
//         },
//         handler: coHandler(function*(request, reply) {
//
//             reply([]);
//         })
//     }
// });
