/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import path from 'path';
import fs from 'fs';
export const command = 'project <directory>';

export const desc = 'Create a new project';

export const builder = {
};

export function handler(argv) {
    let projectRoot = path.resolve(argv.directory);
    if (fs.existsSync(projectRoot) && fs.readdirSync(projectRoot).length>0) {
        return console.error('ERROR: Project root directory cannot be empty.');
    }
    console.log('Creating new project  at %s', projectRoot);
}