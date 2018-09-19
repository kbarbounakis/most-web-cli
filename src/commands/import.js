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
import {getConfiguration} from '../util';

export const command = 'import <file> [options]';

export const desc = 'Import data';

export const DateTimeRegex = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?([+-](\d+):(\d+))?$/;

function reviveDates(key, value){
    if (typeof value === "string" && DateTimeRegex.test(value) ) {
        return new Date(value);
    }
    return value;
}

export function builder(yargs) {
    return yargs.option('model', {
        describe:'the target model'
    }).option('dev', {
        default: false,
        describe: 'enables development mode'
    });
}

export function handler(argv) {
    let options = getConfiguration();
    if (typeof argv.model === 'undefined' || argv.model === null) {
        console.error('ERROR','The target cannot be empty');
        process.exit(1);
    }
    if (argv.dev) {
        //set development mode
        process.env.NODE_ENV='development';
    }
    if (!fs.existsSync(argv.file)) {
        console.error('ERROR','Source data file cannot be found.');
        return process.exit(1);
    }
    let HttpApplication;
    try {
        let appModule = require.resolve('@themost/web/app',{
            paths:[path.resolve(process.cwd(), 'node_modules')]
        });
        HttpApplication = require(appModule).HttpApplication;
    }
    catch(err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error('ERROR','MOST Web Framework module cannot be found.');
        }
        else {
            console.error('ERROR','An error occurred while trying to initialize MOST Web Framework Application.');
            console.error(err);
        }
        return process.exit(1);
    }
    //get data
    console.log('INFO','Getting source data');
    let data;
        return fs.readFile(path.resolve(process.cwd(),argv.file), 'utf8', (err, str)=> {
            if (err) {
                console.error('ERROR','An error occurred while trying to get source data.');
                console.error(err);
                return process.exit(1);
            }

            try {
                data = JSON.parse(str, reviveDates);
            }
            catch(err) {
                console.error('ERROR','An error occurred while converting source data.');
                console.error(err);
                return process.exit(1);
            }

            console.log('INFO','Initializing application');
            let app;
            try {
                app  = new HttpApplication(path.resolve(process.cwd(), options.out));
                let strategy = app.getConfiguration().getStrategy(function DataConfigurationStrategy() {
                });
                //get adapter types
                let adapterTypes = strategy.adapterTypes;
                //get configuration adapter types
                let configurationAdapterTypes = app.getConfiguration().getSourceAt('adapterTypes');
                if (Array.isArray(configurationAdapterTypes)) {
                    configurationAdapterTypes.forEach((configurationAdapterType)=> {
                        if (typeof adapterTypes[configurationAdapterType.invariantName] === 'undefined') {
                            //load adapter type
                            let adapterModulePath = require.resolve(configurationAdapterType.type,{
                                paths:[path.resolve(process.cwd(), 'node_modules')]
                            });
                            let adapterModule = require(adapterModulePath);
                            adapterTypes[configurationAdapterType.invariantName] = {
                                invariantName:configurationAdapterType.invariantName,
                                name: configurationAdapterType.name,
                                createInstance:adapterModule.createInstance
                            }
                        }
                    });
                }
            }
            catch(err) {
                console.error('ERROR','An error occurred while trying to get source data.');
                console.error(err);
                return process.exit(1);
            }

            app.execute((context)=> {
                let model;
                console.log('INFO','Getting target model');
                try {
                    model = context.model(argv.model);
                    if (typeof model === 'undefined' || model === null) {
                        console.error('ERROR','Target model cannot be found');
                        return process.exit(1);
                    }
                }
                catch(err) {
                    console.error('ERROR','An error occurred while getting target model.');
                    console.error(err);
                    return process.exit(1);
                }
                model.silent().save(data).then(()=> {
                    context.finalize(()=> {
                        console.log('INFO','The operation was completed successfully');
                        return process.exit(0);
                    });
                }).catch((err) => {
                    console.error('ERROR','An error occurred while importing data.');
                    console.error(err);
                    return process.exit(1);
                });
            });
        });
}
