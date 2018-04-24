'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.desc = exports.command = undefined;
exports.builder = builder;
exports.handler = handler;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

var _fsExtra = require('fs-extra');

var fs = _interopRequireDefault(_fsExtra).default;

var _util = require('../util');

var getConfiguration = _util.getConfiguration;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var command = exports.command = 'import <file> [options]'; /**
                                                            * @license
                                                            * MOST Web Framework 2.0 Codename Blueshift
                                                            * Copyright (c) 2017, THEMOST LP All rights reserved
                                                            *
                                                            * Use of this source code is governed by an BSD-3-Clause license that can be
                                                            * found in the LICENSE file at https://themost.io/license
                                                            */
var desc = exports.desc = 'Import data';

function builder(yargs) {
    return yargs.option('model', {
        describe: 'the target model'
    }).option('dev', {
        default: false,
        describe: 'enables development mode'
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
    if (!fs.existsSync(argv.file)) {
        console.error('ERROR', 'Source data file cannot be found.');
        return process.exit(1);
    }
    var HttpApplication = void 0;
    try {
        var appModule = require.resolve('@themost/web/app', {
            paths: [path.resolve(process.cwd(), 'node_modules')]
        });
        HttpApplication = require(appModule).HttpApplication;
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error('ERROR', 'MOST Web Framework module cannot be found.');
        } else {
            console.error('ERROR', 'An error occurred while trying to initialize MOST Web Framework Application.');
            console.error(err);
        }
        return process.exit(1);
    }
    //get data
    console.log('INFO', 'Getting source data');
    var data = void 0;
    try {
        data = require(path.resolve(process.cwd(), argv.file));
    } catch (err) {
        console.error('ERROR', 'An error occurred while trying to get source data.');
        console.error(err);
        return process.exit(1);
    }
    console.log('INFO', 'Initializing application');
    var app = void 0;
    try {
        app = new HttpApplication(path.resolve(process.cwd(), options.dist));
    } catch (err) {
        console.error('ERROR', 'An error occurred while trying to get source data.');
        console.error(err);
        return process.exit(1);
    }

    app.execute(function (context) {
        var model = void 0;
        console.log('INFO', 'Getting target model');
        try {
            model = context.model(argv.model);
            if (typeof model === 'undefined' || model === null) {
                console.error('ERROR', 'Target model cannot be found');
                return process.exit(1);
            }
        } catch (err) {
            console.error('ERROR', 'An error occurred while getting target model.');
            console.error(err);
            return process.exit(1);
        }
        model.silent().save(data).then(function () {
            context.finalize(function () {
                console.log('INFO', 'The operation was completed successfully');
                return process.exit(0);
            });
        }).catch(function (err) {
            console.error('ERROR', 'An error occurred while importing data.');
            console.error(err);
            return process.exit(1);
        });
    });
}
//# sourceMappingURL=import.js.map
