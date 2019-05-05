'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.desc = exports.command = undefined;
exports.builder = builder;
exports.generateAnyClass = generateAnyClass;
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
var getBuilder = _util.getBuilder;

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
    }).option('force', {
        default: false,
        describe: 'replace if exists'
    });
}

function generateAnyClass(argv) {

    //get cli options
    var options = getConfiguration();
    //get data configuration
    var config = getDataConfiguration(options);
    //get OData Builder
    var builder = getBuilder(config);
    var sources = [];
    return builder.getEdm().then(function (schema) {
        console.log('INFO', argv);
        if (argv.name === 'app' || argv.name === '*') {
            sources = schema.entityType.map(function (x) {
                return generateClass(Object.assign({
                    inProcClass: []
                }, argv, {
                    "name": x.name,
                    "silent": true
                }), true);
            });
        } else {
            sources = argv.name.split('+').map(function (x) {
                return generateClass(Object.assign({
                    inProcClass: []
                }, argv, {
                    "name": x,
                    "silent": true
                }), false);
            });
        }
        return Promise.all(sources);
    });
}

function generateClass(argv, ignoreOther) {
    return new Promise(function (resolve, reject) {
        //get cli options
        var options = getConfiguration();
        //get data configuration
        var config = getDataConfiguration(options);
        //validating name
        if (!/^[a-zA-Z0-9_-]+$/.test(argv.name)) {
            console.error('ERROR', 'An error occurred while validating class name.');
            return reject(new Error('Class name is not valid. Expected only latin characters, numbers or "_,-" characters.'));
        }
        //--
        var context = new SimpleDataContext(config);
        argv.inProcClass = argv.inProcClass || [];
        if (argv.inProcClass.indexOf(argv.name) >= 0) {
            return resolve();
        }
        //get OData Builder
        var builder = getBuilder(config);
        return builder.getEdm().then(function (schema) {
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
            model.imports = [];
            if (model.inherits) {
                model.inheritsClassPath = "./".concat(_.dasherize(model.inherits).concat('-model'));
                model.imports.push({
                    "name": model.inherits,
                    "from": model.inheritsClassPath
                });
            } else {
                model.imports.push({
                    "name": "{DataObject}",
                    "from": "@themost/data/data-object"
                });
            }
            model.attributes.forEach(function (x) {
                //format data type
                var dataType = dataTypes[x.type];
                if (typeof x.type === 'undefined') {
                    x.typeName = x.many ? "Array<*>" : "*";
                    return;
                }
                if (!x.hasOwnProperty('nullable')) {
                    x.nullable = true;
                }
                //add import
                if (x.model === model.name) {
                    var importModel = context.model(x.type);
                    if (importModel && importModel.name !== model.name) {
                        if (typeof model.imports.find(function (x) {
                            return x.name === importModel.name;
                        }) === 'undefined') {
                            model.imports.push({
                                "name": importModel.name,
                                "from": "./".concat(_.dasherize(importModel.name).concat('-model'))
                            });
                        }
                        x.typeName = x.many ? "Array<" + x.type + "|any>" : x.type + "|any";
                        return;
                    }
                }
                if (dataType) {
                    x.typeName = x.many ? "Array<" + dataType.type + ">" : dataType.type;
                    return;
                }
                x.typeName = x.many ? "Array<" + x.type + ">" : x.type;
            });
            //get file name
            var destFile = _.dasherize(argv.name).concat('-model').concat(options.mode === 'typescript' ? '.ts' : '.js');
            console.log('INFO', 'Generating class ' + destFile);
            var destPath = path.resolve(process.cwd(), options.base, 'models/' + destFile);
            console.log('INFO', 'Validating class path ' + destPath);
            if (fs.existsSync(destPath) && !argv.force) {
                if (argv.silent) {
                    console.error('WARNING', 'The specified class [' + argv.name + '] already exists.');
                    return resolve();
                }
                console.error('ERROR', 'An error occurred while validating class.');
                return reject(new Error('The specified class already exists.'));
            }
            //get template file path
            var templateFile = path.resolve(__dirname, '../../../templates/generate/class' + (options.mode === 'typescript' ? '.ts' : '.js') + '.ejs');
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
                    if (ignoreOther) {
                        return resolve();
                    }
                    //add in-process class
                    argv.inProcClass.push(model.name);
                    var generateExtra = model.imports.filter(function (x) {
                        return x.name !== "{DataObject}" && x.name !== model.name;
                    }).map(function (x) {
                        return generateClass(Object.assign({}, argv, {
                            "name": x.name,
                            "silent": true
                        }));
                    });
                    Promise.all(generateExtra).then(function () {
                        if (options.mode === 'typescript') {
                            return resolve();
                        }
                        return resolve();
                    }).catch(function (err) {
                        return reject(err);
                    });
                }).catch(function (err) {
                    console.error('ERROR', 'An error occurred while generating data model class.');
                    return reject(err);
                });
            });
        });
    });
}

function handler(argv) {
    generateAnyClass(argv).then(function () {
        return process.exit(0);
    }).catch(function (err) {
        console.error(err);
        return process.exit(1);
    });
}
//# sourceMappingURL=class.js.map
