/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import path from 'path';
import {existsSync, readdirSync, copy} from 'fs-extra';
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
            console.log('Operation was completed successfully');
            return process.exit(0);
        });
    
}