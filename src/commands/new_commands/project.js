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
export const command = 'project <directory>';

export const desc = 'Create a new project';

export const builder = {
};

export function handler(argv) {
    let projectRoot = path.resolve(process.cwd(), argv.directory);
    if (fs.existsSync(projectRoot) && fs.readdirSync(projectRoot).length>0) {
        return console.error('ERROR: Project root directory must be empty.');
    }
    console.log('Creating new project  at %s', projectRoot);
    //get template path
    let templateRoot = path.resolve(__dirname, './../../../templates/api');
    fs.copy(templateRoot, projectRoot, err => {
            if (err) {
                console.error('ERROR: An error occurred while generating new project.');
                console.error(err);
                return process.exit(1);
            }
            console.log('Operation was completed successfully');
            return process.exit(0);
        });
    
}