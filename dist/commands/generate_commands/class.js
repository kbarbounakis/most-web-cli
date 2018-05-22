'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.desc = exports.command = undefined;
exports.builder = builder;
exports.generateClass = generateClass;
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
var getDataConfiguration = _util.getDataConfiguration;
var SimpleDataContext = _util.SimpleDataContext;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
var command = exports.command = 'class <name>';

var desc = exports.desc = 'Generate a new data model class';

function builder(yargs) {
    return yargs.option('silent', {
        default: false,
        describe: 'disable errors'
    });
}

function generateClass(argv) {
    return new Promise(function (resolve, reject) {
        var options = getConfiguration();
        var config = getDataConfiguration(options);
        //validating name
        if (!/^[a-zA-Z0-9_-]+$/.test(argv.name)) {
            console.error('ERROR', 'An error occurred while validating class name.');
            return reject(new Error('Class name is not valid. Expected only latin characters, numbers or "_,-" characters.'));
        }
        //--
        var context = new SimpleDataContext(config);
        //get model definition
        var emptyModel = {
            name: _.upperFirst(_.camelCase(argv.name)),
            fields: [],
            attributes: [],
            inherits: null
        };
        var dataTypes = config.getDataConfiguration().dataTypes;
        var model = context.model(argv.name) || emptyModel;
        model.inherits = model.inherits || null;
        if (model.inherits) {
            model.inheritsClassPath = "./".concat(_.dasherize(model.inherits).concat('-model'));
        }
        model.attributes.forEach(function (x) {
            //format data type
            var dataType = dataTypes[x.type];
            if (typeof x.type === 'undefined') {
                x.typeName = x.many ? "Array<*>" : "*";
                return;
            }
            if (dataType) {
                x.typeName = x.many ? "Array<" + dataType.type + ">" : dataType.type;
                return;
            }
            x.typeName = x.many ? "Array<" + x.type + ">" : x.type;
        });
        //get file name
        var destFile = _.dasherize(argv.name).concat('-model.js');
        console.log('INFO', 'Generating class ' + destFile);
        var destPath = path.resolve(process.cwd(), options.base, 'models/' + destFile);
        console.log('INFO', 'Validating class path ' + destPath);
        if (fs.existsSync(destPath)) {
            if (argv.silent) {
                console.error('WARNING', 'The specified class [' + argv.name + '] already exists.');
                return resolve();
            }
            console.error('ERROR', 'An error occurred while validating class.');
            return reject(new Error('The specified class already exists.'));
        }
        //get template file path
        var templateFile = path.resolve(__dirname, '../../../templates/generate/class.js.ejs');
        //get destination folder path
        var destFolder = path.dirname(destPath);
        console.error('INFO', 'Validating class folder (' + destFolder + ').');
        fs.ensureDir(destFolder, function (err) {
            if (err) {
                console.error('ERROR', 'An error occurred while validating destination path.');
                return reject(err);
            }
            writeFileFromTemplate(templateFile, destPath, model).then(function () {
                console.log('INFO', 'The operation was completed succesfully.');
                if (model.inherits) {
                    return generateClass(Object.assign({}, argv, {
                        "name": model.inherits
                    })).then(function () {
                        return resolve();
                    }).catch(function (err) {
                        return reject(err);
                    });
                }
                return resolve();
            }).catch(function (err) {
                console.error('ERROR', 'An error occurred while generating data model class.');
                return reject(err);
            });
        });
    });
}

function handler(argv) {
    generateClass(argv).then(function () {
        return process.exit(0);
    }).catch(function (err) {
        console.error(err);
        return process.exit(1);
    });
}
//# sourceMappingURL=class.js.map
