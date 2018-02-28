'use strict';

const Joi = require('joi');
const { coHandler } = require('../utils');
const Promise = require('bluebird');
const player = require('../controllers/player/player');
const scouter = require('../controllers/scouter/scouter');
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
        },
        {
            method: 'GET',
            path: options.prefix + options.playerPrefix + '/login',
            config: {
                tags: ['api'],
                handler: player.login,
                validate: {
                    query: {
                        username: Joi.string().min(6).required(),
                        password: Joi.string().min(6).required()
                    }
                },
                response: {
                    schema: Joi.object({
                        name: Joi.string().description("player's name"),
                        age: Joi.number().description("player's age"),
                        leg: Joi.string().description("player's favourite leg"),
                        position: Joi.string().description("player's position on pitch"),
                        team: Joi.string().description("player's football team"),
                        country: Joi.string().description("player's birth country")
                    }).label('Example Response Object')
                }
            }
        },
        {
            method: 'POST',
            path: options.prefix + options.scouterPrefix + '/register',
            config: {
                tags: ['api'],
                handler: scouter.register,
                validate: {
                    payload: {
                        name: Joi.string().min(1).required(),
                        team: Joi.string().required(),
                        country: Joi.string().required(),
                        username: Joi.string().min(6).required(),
                        password: Joi.string().min(6).required()
                    }
                }
            }
        },
        {
            method: 'GET',
            path: options.prefix + options.scouterPrefix + '/login',
            config: {
                tags: ['api'],
                handler: scouter.login,
                validate: {
                    query: {
                        username: Joi.string().min(6).required(),
                        password: Joi.string().min(6).required()
                    }
                },
                response: {
                    schema: Joi.object({
                        name: Joi.string().description("scouter's name"),
                        team: Joi.string().description("scouter's football team"),
                        country: Joi.string().description("scouter's birth country")
                    }).label('Example Response Object')
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