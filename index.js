'use strict';
const Promise = require('bluebird');

require('./server')()
    .then((server) => {

        Promise.promisify(server.start, { context: server })()
            .then(() => {

                server.log([], `server running at ${server.info.uri}`);
            })
            .catch((err) => {

                console.error(err);
            });
    });
