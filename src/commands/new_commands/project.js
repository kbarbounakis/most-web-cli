/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import path from 'path';
export const command = 'project <directory>';

export const desc = 'Create a new project';

export const builder = {
};

export function handler(argv) {
    console.log('creating new project  at %s', path.resolve(argv.directory));
}