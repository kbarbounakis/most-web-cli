/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import { writeFileFromTemplate, getConfiguration, getDataConfiguration, SimpleDataContext } from '../../util';

export const command = 'class <name>';

export const desc = 'Generate a new data model class';

export function builder(yargs) {
    return yargs.option('silent', {
        default: false,
        describe: 'disable errors'
    });
}

export function generateClass(argv) {
    return new Promise((resolve, reject) => {
        let options = getConfiguration();
        let config = getDataConfiguration(options);
        //validating name
        if (!/^[a-zA-Z0-9_-]+$/.test(argv.name)) {
            console.error('ERROR', 'An error occurred while validating class name.');
            return reject(new Error('Class name is not valid. Expected only latin characters, numbers or "_,-" characters.'));
        }
        //--
        let context = new SimpleDataContext(config);
        //get model definition
        let emptyModel = {
                name: _.upperFirst(_.camelCase(argv.name)),
                fields: [],
                attributes:[],
                inherits: null
            };
        let dataTypes = config.getDataConfiguration().dataTypes;
        let model = context.model(argv.name) || emptyModel;
        model.inherits = model.inherits || null; 
        if (model.inherits) {
            model.inheritsClassPath = "./".concat(_.dasherize(model.inherits).concat('-model'));
        }
        model.attributes.forEach((x)=> {
           //format data type
            let dataType = dataTypes[x.type];
            if (typeof x.type === 'undefined') {
                x.typeName = x.many ?  "Array<*>" : "*";
                return;
            }
            if (dataType) {
                x.typeName = x.many ?  "Array<" + dataType.type + ">" : dataType.type;
                return;
            }
            x.typeName = x.many ?  "Array<" + x.type + ">" : x.type;
        });
        //get file name
        let destFile = _.dasherize(argv.name).concat('-model.js');
        console.log('INFO', `Generating class ${destFile}`);
        let destPath = path.resolve(process.cwd(), options.base, `models/${destFile}`);
        console.log('INFO', `Validating class path ${destPath}`);
        if (fs.existsSync(destPath)) {
            if (argv.silent) {
                console.error('WARNING', `The specified class [${argv.name}] already exists.`);
                return resolve();
            }
            console.error('ERROR', 'An error occurred while validating class.');
            return reject(new Error('The specified class already exists.'));
        }
        //get template file path
        let templateFile = path.resolve(__dirname, '../../../templates/generate/class.js.ejs');
        //get destination folder path
        let destFolder = path.dirname(destPath);
        console.error('INFO', `Validating class folder (${destFolder}).`);
        fs.ensureDir(destFolder, (err) => {
            if (err) {
                console.error('ERROR', 'An error occurred while validating destination path.');
                return reject(err);
            }
            writeFileFromTemplate(templateFile, destPath, model).then(() => {
                console.log('INFO', 'The operation was completed succesfully.');
                if (model.inherits) {
                    return generateClass(Object.assign({}, argv, {
                        "name": model.inherits
                    })).then(()=> {
                        return resolve();
                    }).catch((err)=> {
                        return reject(err);
                    });
                }
                return resolve();
            }).catch((err) => {
                console.error('ERROR', 'An error occurred while generating data model class.');
                return reject(err);
            });

        });
    });
}

export function handler(argv) {
    generateClass(argv).then(() => {
        return process.exit(0);
    }).catch((err) => {
        console.error(err);
        return process.exit(1);
    });
}