/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import path from 'path';
import crypto from 'crypto';
import {existsSync, readdirSync, copy, readFile, writeFile} from 'fs-extra';
export const command = 'project <directory>';


export const desc = 'Create a new project';

export function builder(yargs) {
    return yargs.option('template', {
        describe:'the target template',
        choices: ['api', 'express', 'classic'],
        default:'classic'
    }).option('typescipt', {
        describe:'generates a typescript project',
        default: false,
        type: 'boolean'
    });
}

/**
 *
 * @param {{template: string, typescript: boolean, directory: string}} argv
 * @returns {*}
 */
export function handler(argv) {
    let projectRoot = path.resolve(process.cwd(), argv.directory);
    if (existsSync(projectRoot) && readdirSync(projectRoot).length>0) {
        console.error('ERROR: Project root directory must be empty.');
        return process.exit(1);
    }
    console.log('Creating new project  at %s', projectRoot);
    //get template path
    let  templateRoot = path.resolve(__dirname, `./../../../templates/${argv.template}_project`);
    if (argv.typescript) {
        templateRoot = path.resolve(__dirname, `./../../../templates/typescript/${argv.template}_project`);
    }

    //validate template folder
    if (!existsSync(templateRoot)) {
        console.error('ERROR: The specified template cannot be found.');
        return process.exit(1);
    }
    copy(templateRoot, projectRoot, err => {
            if (err) {
                console.error('ERROR: An error occurred while generating new project.');
                console.error(err);
                return process.exit(1);
            }
            Promise.all([
                updateApplicationConfiguration(argv)
                ]).then(()=> {
                    console.log('Operation was completed successfully');
                    return process.exit(0);
                }).catch(err => {
                    console.error('ERROR: An error occurred while executing post operations.');
                    console.error(err);
                    return process.exit(1);
                });
        });
    
}

function updateApplicationConfiguration(argv) {
    return new Promise((resolve, reject) => {
        let projectRoot = path.resolve(process.cwd(), argv.directory);
        let appJsonPath = path.resolve(projectRoot, 'server/config/app.json');
        // generate application key
        if (existsSync(appJsonPath)) {
            return readFile(appJsonPath, 'utf8', (err, str)=> {
               if (err) {
                   return reject(err);
               } 
               let data = JSON.parse(str);
               return crypto.randomBytes(48, (err, buffer) => {
                   if (err) {
                       return reject(err);
                   }
                   // set application key
                  data.settings.crypto.key = buffer.toString('hex');
                  return crypto.randomBytes(12, (err, buffer) => {
                       if (err) {
                           return reject(err);
                       }
                       // set unattended execution account
                      data.settings.auth.unattendedExecutionAccount = buffer.toString('base64');
                      // write app.json
                      return writeFile(appJsonPath, JSON.stringify(data, null, 4), 'utf8', (err) => {
                          if (err) {
                              return reject(err);
                          }
                          return resolve();
                      })
                    });
                });
            });
        }
        return resolve();
    });
}