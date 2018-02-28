'use strict';

const Joi = require('joi');
const { coHandler } = require('../utils');
const Promise = require('bluebird');
const player = require('../controllers/player/player');
const iscountconf = require('../config').iscout;

exports.routes = Promise.coroutine(function*(server, options) {

    let routesArray = [
        {
            method: 'POST',
            path: options.prefix + options.playerPrefix + '/register',
            config: {
                tags: ['api'],
                handler: player.register,
                validate: {
                    payload: {
                        name: Joi.string().min(1).required(),
                        age: Joi.number().min(10).max(120).required(),
                        leg: Joi.string().valid(iscountconf.feet).required(),
                        position: Joi.string().valid(Object.keys(iscountconf.positionsToId)).required(),
                        team: Joi.string().required(),
                        country: Joi.string().required(),
                        username: Joi.string().min(6).required(),
                        password: Joi.string().min(6).required()
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

// {
//     method: 'GET',
//         path: options.prefix + '/add',
//     config: {
//     tags: ['api'],
//         handler: calc.add,
//         validate: {
//         query: {
//             x: Joi.number(),
//                 y: Joi.number()
//         }
//     }
// }
// },