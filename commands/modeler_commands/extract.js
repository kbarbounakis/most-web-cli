/**
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
const generateModel = require('../../modeler/modeler').generateModel;
const getConfiguration = require('../../util').getConfiguration;
const path = require('path');

module.exports.command = 'extract <model> [options]';
module.exports.desc = 'Extracts the specified model';

module.exports.builder = function builder(yargs) {
    return yargs;
};


module.exports.handler = function (argv) {
    // get options
    let options = getConfiguration();
    // get output directory
    let outDir = path.resolve(process.cwd(), options.base, 'config/models/');
    // generate model
    const sources = [
        generateModel(argv.model, outDir),
        generateModel('User', outDir),
        generateModel('Permission', outDir)
    ]
    return Promise.all(sources).then(()=> {
        console.log('INFO', 'EXTRACT', 'The operation was completed successfully.');
        return process.exit(0);
    }).catch((err)=> {
        console.log('ERROR', 'EXTRACT', 'An error occurred while extracting model.');
        console.error(err);
        return process.exit(1);
    });
}
