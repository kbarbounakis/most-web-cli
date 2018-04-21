/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
export const command = 'random <type> [options]';

export const desc = 'Create a new random string, integer or guid';


export function builder(yargs) {
    return yargs.option('type', {
        alias:'t',
        choices: ['int', 'string', 'guid', 'hex'],
        default:'int'
    }).option('min', {
        default:0
    }).option('max', {
        default:1000000
    }).option('length', {
        alias:'l',
        default:8
    });
}

export function handler(argv) {
    if (argv.type === 'int') {
        return console.log(RandomCommand.randomInt(argv.min,argv.max));
    }
    else if (argv.type === 'hex') {
        return console.log(RandomCommand.randomHex(argv.length));
    }
    else if (argv.type === 'guid') {
        return console.log(RandomCommand.newGuid());
    }
    else if (argv.type === 'string') {
        return console.log(RandomCommand.randomString(argv.length));
    }
}

const UUID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

export class RandomCommand {

    static randomInt(min, max) {
        return Math.floor(Math.random()*max) + min;
    }

    /**
     *
     * @param {number=} length
     * @return {string}
     */
    static randomHex(length) {
        length = length || 16;
        return new Buffer(RandomCommand.randomString(length)).toString('hex');
    }

    /**
     *
     * @param {number=} length
     * @return {string}
     */
    static randomString(length) {
        length = length || 16;
        let chars = "abcdefghkmnopqursuvwxz2456789ABCDEFHJKLMNPQURSTUVWXYZ";
        let str = "";
        for(let i = 0; i < length; i++) {
            str += chars.substr(RandomCommand.randomInt(0, chars.length-1),1);
        }
        return str;
    }

    /**
     *
     * @return {string}
     */
    static  newGuid() {
        let chars = UUID_CHARS, uuid = [], i;
        // rfc4122, version 4 form
        let r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    }

}