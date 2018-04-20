/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import path from 'path';

export const command = 'new <command>';

export const desc = 'Create a new component';

export function builder(yargs) {
    return yargs.commandDir(path.resolve(__dirname, 'new_commands'));
}

export function handler() {

}