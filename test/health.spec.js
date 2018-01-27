'use strict';

const Promise = require('bluebird');
const Code = require('code');
const Lab = require('lab');
const { inject } = require('../lib/utils');

const lab = exports.lab = Lab.script();
const { describe, it, before } = lab;
const expect = Code.expect;

describe('health check endpoint', () => {

    let server;

    const routeOpts = {
        method: 'GET',
        url: '/_ah/health'
    };

    before(() => require('../server')()
        .then((_server) => {

            server = _server;
            return Promise.fromCallback(server.initialize.bind(server));
        }));

    it('should return status code 200', () =>

        inject(server, routeOpts)
            .then((res) => expect(res.statusCode).to.equal(200))
    );

});
