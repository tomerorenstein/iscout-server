'use strict';

const Hapi = require('hapi');
const Promise = require('bluebird');
const Package = require('./package.json');
const Config = require('./lib/config');

const healthCheck = function (server, cb) {

    cb();
};

//$lab:coverage:off$
const getGoodReporters = () => {

    if (Config.isTesting) {
        return {};
    }

    const reporters = {
        console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', request: '*', response: '*' }]
        }, {
            module: 'good-requests-filter',
            args: [{
                paths: [
                    /\/_ah\/*/,
                    /\/swaggerui\/*/
                ]
            }]
        }, {
            module: 'good-console'
        }, {
            module: 'good-separator'
        }, 'stdout'],

        error: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ error: '*' }]
        }, {
            module: 'good-console'
        }, {
            module: 'good-separator'
        }, 'stderr']
    };

    return reporters;
};
//$lab:coverage:on$

module.exports = Promise.coroutine(function*() {

    const server = new Hapi.Server();
    server.connection({
        port: Config.port,
        labels: ['api']
    });

    yield Promise.promisify(server.register, { context: server })([
        Config,
        {
            register: require('hapi-alive'),
            options: {
                path: '/_ah/health',
                healthCheck
            }
        }, {
            register: require('good'),
            options: {
                ops: {
                    interval: 1000
                },
                reporters: getGoodReporters()
            }
        },
        require('inert'),
        require('vision'),
        {
            register: require('hapi-swagger'),
            options: {
                info: {
                    title: 'calculator',
                    version: Package.version
                }
            }
        },
        {
            register: require('./lib/routes_settings'),
            options: {
                prefix: '/api'
            }
        }
    ]);

    return server;
});
