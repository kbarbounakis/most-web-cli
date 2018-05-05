'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.desc = exports.command = undefined;
exports.builder = builder;
exports.handler = handler;

var _util = require('../util');

var getConfiguration = _util.getConfiguration;
var getHttpApplication = _util.getHttpApplication;


var QUERY_OPTS = ['filter', 'expand', 'order', 'group', 'top', 'skip', 'count', 'select']; /**
                                                                                            * @license
                                                                                            * MOST Web Framework 2.0 Codename Blueshift
                                                                                            * Copyright (c) 2017, THEMOST LP All rights reserved
                                                                                            *
                                                                                            * Use of this source code is governed by an BSD-3-Clause license that can be
                                                                                            * found in the LICENSE file at https://themost.io/license
                                                                                            */
var command = exports.command = 'cat <model> [options]';

var desc = exports.desc = 'Query data';

function builder(yargs) {
    return yargs.option('model', {
        describe: 'the target model'
    }).option('dev', {
        default: false,
        describe: 'enables development mode'
    }).option('filter', {
        default: null,
        describe: 'defines query filter'
    }).option('expand', {
        default: null,
        describe: 'defines query expand option'
    }).option('group', {
        default: null,
        describe: 'defines query group by option'
    }).option('top', {
        default: 25,
        describe: 'defines query top option'
    }).option('skip', {
        default: 0,
        describe: 'defines query skip option'
    }).option('count', {
        default: false,
        describe: 'defines query count option'
    }).option('select', {
        default: null,
        describe: 'defines query select option'
    }).option('order', {
        default: null,
        describe: 'defines query order by option'
    });
}

function handler(argv) {
    var options = getConfiguration();
    if (typeof argv.model === 'undefined' || argv.model === null) {
        console.error('ERROR', 'The target cannot be empty');
        process.exit(1);
    }
    if (argv.dev) {
        //set development mode
        process.env.NODE_ENV = 'development';
    }
    var app = getHttpApplication(options);
    app.execute(function (context) {
        try {
            var model = context.model(argv.model);
            if (typeof model === 'undefined' || model === null) {
                console.error('ERROR', 'Target model cannot be found.');
                return process.exit(1);
            }
            var query = {};
            QUERY_OPTS.forEach(function (x) {
                if (argv.hasOwnProperty(x) && argv[x]) {
                    query['$' + x] = argv[x];
                }
            });
            //build query options
            model.filter(query, function (err, q) {
                if (err) {
                    console.error('ERROR', 'An error occurred while applying query.');
                    console.error(err);
                    return process.exit(1);
                }

                var source = argv.count ? q.silent().getList() : q.silent().getItems();
                return source.then(function (res) {
                    if (res) {
                        if (argv.top === 1 && !argv.count) {
                            console.log(JSON.stringify(res[0], null, 4));
                        } else {
                            console.log(JSON.stringify(res, null, 4));
                        }
                    }
                    process.exit(0);
                }).catch(function (err) {
                    console.error('ERROR', 'An error occurred while querying data.');
                    console.error(err);
                    return process.exit(1);
                });
            });
        } catch (err) {
            console.error('ERROR', 'An error occurred while getting data.');
            console.error(err);
            process.exit(1);
        }
    });
}
//# sourceMappingURL=cat.js.map
