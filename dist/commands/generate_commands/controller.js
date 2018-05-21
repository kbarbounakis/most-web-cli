'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.builder = exports.desc = exports.command = undefined;
exports.handler = handler;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

var _fsExtra = require('fs-extra');

var fs = _interopRequireDefault(_fsExtra).default;

var _lodash = require('lodash');

var _ = _interopRequireDefault(_lodash).default;

var _util = require('../../util');

var writeFileFromTemplate = _util.writeFileFromTemplate;
var getConfiguration = _util.getConfiguration;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
var command = exports.command = 'controller <name>';

var desc = exports.desc = 'Generate a new controller';

var builder = exports.builder = {};

function handler(argv) {
    var options = getConfiguration();
    //validating controller name
    if (!/^[a-zA-Z0-9_]+$/.test(argv.name)) {
        console.error('ERROR', 'Controller name is not valid. Expected only latin characters, numbers or "_" character.');
        return process.exit(1);
    }
    //get controller name
    var controllerName = /controller$/i.test(argv.name) ? _.upperFirst(_.camelCase(argv.name)) : _.upperFirst(_.camelCase(argv.name.concat('-controller')));
    //get controller file name
    var controllerFile = _.dasherize(controllerName).concat('.js');
    console.log('INFO', 'Generating controller ' + controllerFile);
    var controllerPath = path.resolve(process.cwd(), options.base, 'controllers/' + controllerFile);
    console.log('INFO', 'Validating controller path ' + controllerPath);
    if (fs.existsSync(controllerPath)) {
        console.error('ERROR', 'The specified controller already exists.');
        return process.exit(1);
    }
    //get template file path
    var templateFile = path.resolve(__dirname, '../../../templates/generate/controller.js.ejs');

    //get destination folder path
    var destFolder = path.dirname(controllerPath);
    console.error('INFO', 'Validating controller folder (' + destFolder + ').');
    fs.ensureDir(destFolder, function (err) {
        if (err) {
            console.error('ERROR', 'An error occurred while validating destination path.');
            console.error(err);
        }
        writeFileFromTemplate(templateFile, controllerPath, {
            name: controllerName.replace(/Controller$/i, '')
        }).then(function () {
            console.log('INFO', 'The operation was completed succesfully.');
            return process.exit(0);
        }).catch(function (err) {
            console.error('ERROR', 'An error occurred while generating controller.');
            console.error(err);
            return process.exit(1);
        });
    });
}
//# sourceMappingURL=controller.js.map
