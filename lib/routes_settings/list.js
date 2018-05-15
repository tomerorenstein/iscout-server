'use strict';

const Joi = require('joi');
const { coHandler } = require('../utils');
const Promise = require('bluebird');
const player = require('../controllers/player/player');
const scouter = require('../controllers/scouter/scouter');
const global = require('../controllers/global/global');
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
                        team: Joi.number().required(),
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
                        user_id: Joi.number().description("user's id"),
                        player_id: Joi.number().description("player's id"),
                        name: Joi.string().description("player's name"),
                        age: Joi.number().description("player's age"),
                        leg: Joi.string().description("player's favourite leg"),
                        position: Joi.string().description("player's position on pitch"),
                        team: Joi.number().description("player's football team"),
                        country: Joi.string().description("player's birth country"),
                        videos_url: Joi.array().items(Joi.string()),
                        img: Joi.string().allow('').description("player's image base64")
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
                        team: Joi.number().required(),
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
                        user_id: Joi.number().description("user's id"),
                        scouter_id: Joi.number().description("scouter's id"),
                        name: Joi.string().description("scouter's name"),
                        team: Joi.number().description("scouter's football team"),
                        country: Joi.string().description("scouter's birth country")
                    }).label('Example Response Object')
                }
            }
        },
        {
            method: 'GET',
            path: options.prefix + options.playerPrefix + '/info',
            config: {
                tags: ['api'],
                handler: player.getPlayerInfo,
                validate: {
                    query: {
                        playerid: Joi.number()
                    }
                },
                response: {
                    schema: Joi.object({
                        name: Joi.string().description("player's name"),
                        age: Joi.number().description("player's age"),
                        leg: Joi.string().description("player's favourite leg"),
                        position: Joi.string().description("player's position on pitch"),
                        team: Joi.number().description("player's football team"),
                        country: Joi.string().description("player's birth country"),
                        own_description: Joi.string().allow('').description("player's personal description"),
                        videos_url: Joi.array().items(Joi.string()),
                        img: Joi.string().allow('').description("player's image base64")
                    }).label('Example Response Object')
                }
            }
        },
        {
            method: 'GET',
            path: options.prefix + options.playerPrefix + '/statistics',
            config: {
                tags: ['api'],
                handler: player.getPlayerStatistics,
                validate: {
                    query: {
                        playerid: Joi.number()
                    }
                },
                response: {
                    schema: Joi.array().items(Joi.object({
                        year: Joi.number().description("statistic year"),
                        goals: Joi.number().description("player's goals in that year"),
                        assists: Joi.number().description("player's assists in that year"),
                        games_in_starting_linup: Joi.number()
                            .description("player's number of games in starting lineup in that year"),
                        games_entered_from_bench: Joi.number()
                            .description("player's number of games entered from bench in that year"),
                        yellow_cards: Joi.number().description("player's yellow cards number in that year"),
                        red_cards: Joi.number().description("player's red cards number in that year"),
                        average_km_per_game: Joi.number().description("player's average km per game in that year")
                    })).label('Example Response Object')
                }
            }
        },
        {
            method: 'GET',
            path: options.prefix + options.playerPrefix + '/search',
            config: {
                tags: ['api'],
                handler: player.search,
                validate: {
                    query: {
                        page: Joi.number().greater(0),
                        name: Joi.string(),
                        age: Joi.number().description("player age (range of 2 up 2 down - ex. age=24 range of 22-26)"),
                        leg: Joi.string().valid(iscountconf.feet),
                        position: Joi.string().valid(Object.keys(iscountconf.positionsToId)),
                        team: Joi.string(),
                        country: Joi.string(),
                        year: Joi.number().description("statistic year"),
                        goals: Joi.number().description("player's goals in that year"),
                        assists: Joi.number().description("player's assists in that year"),
                        games_in_starting_linup: Joi.number()
                            .description("player's number of games in starting lineup in that year"),
                        games_entered_from_bench: Joi.number()
                            .description("player's number of games entered from bench in that year"),
                        yellow_cards: Joi.number().description("player's yellow cards number in that year"),
                        red_cards: Joi.number().description("player's red cards number in that year"),
                        average_km_per_game: Joi.number().description("player's average km per game in that year")
                    }
                },
                response: {
                    schema: Joi.array().items(Joi.object({
                        player_basic_info: Joi.object({
                            name: Joi.string().description("player's name"),
                            age: Joi.number().description("player's age"),
                            leg: Joi.string().description("player's favourite leg"),
                            position: Joi.string().description("player's position on pitch"),
                            team: Joi.number().description("player's football team"),
                            country: Joi.string().description("player's birth country"),
                            own_description: Joi.string().allow('').description("player's personal description"),
                            videos_url: Joi.array().items(Joi.string()),
                            img: Joi.string().allow('').description("player's image base64")
                        }),
                        player_statistics: Joi.array().items(Joi.object({
                            year: Joi.number().description("statistic year"),
                            goals: Joi.number().description("player's goals in that year"),
                            assists: Joi.number().description("player's assists in that year"),
                            games_in_starting_linup: Joi.number()
                                .description("player's number of games in starting lineup in that year"),
                            games_entered_from_bench: Joi.number()
                                .description("player's number of games entered from bench in that year"),
                            yellow_cards: Joi.number().description("player's yellow cards number in that year"),
                            red_cards: Joi.number().description("player's red cards number in that year"),
                            average_km_per_game: Joi.number().description("player's average km per game in that year")
                        }))
                    })).label('Example Response Object')
                }
            }
        },
        {
            method: 'GET',
            path: options.prefix + options.scouterPrefix + '/search',
            config: {
                tags: ['api'],
                handler: scouter.search,
                validate: {
                    query: {
                        name: Joi.string(),
                        team: Joi.string(),
                        country: Joi.string()
                    }
                },
                response: {
                    schema: Joi.array().items(Joi.object({
                        name: Joi.string(),
                        team: Joi.string(),
                        country: Joi.string()
                    })).label('Example Response Object')
                }
            }
        },
        {
            method: 'GET',
            path: options.prefix + options.globalPrefix + '/teams',
            config: {
                tags: ['api'],
                handler: global.teams,
                validate: {
                    query: {}
                },
                response: {
                    schema: Joi.array().items(Joi.object({
                        id: Joi.number(),
                        country: Joi.string(),
                        name: Joi.string(),
                        lat: Joi.number(),
                        lon: Joi.number()
                    })).label('Example Response Object')
                }
            }
        },
        {
            method: 'PUT',
            path: options.prefix + options.playerPrefix + '/description',
            config: {
                tags: ['api'],
                handler: player.updateDescription,
                validate: {
                    payload: {
                        own_description: Joi.string().min(1).required(),
                        player_id: Joi.number().required()
                    }
                }
            }
        },
        {
            method: 'POST',
            path: options.prefix + options.playerPrefix + '/video',
            config: {
                tags: ['api'],
                handler: player.uploadVideo,
                validate: {
                    payload: {
                        player_id: Joi.number().required(),
                        youtube_url: Joi.string().required()
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