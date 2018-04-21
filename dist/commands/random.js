'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.builder = builder;
exports.handler = handler;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
var command = exports.command = 'random <type> [options]';

var desc = exports.desc = 'Create a new random string, integer or guid';

function builder(yargs) {
    return yargs.option('type', {
        alias: 't',
        choices: ['int', 'string', 'guid', 'hex'],
        default: 'int'
    }).option('min', {
        default: 0
    }).option('max', {
        default: 1000000
    }).option('length', {
        alias: 'l',
        default: 8
    });
}

function handler(argv) {
    if (argv.type === 'int') {
        return console.log(RandomCommand.randomInt(argv.min, argv.max));
    } else if (argv.type === 'hex') {
        return console.log(RandomCommand.randomHex(argv.length));
    } else if (argv.type === 'guid') {
        return console.log(RandomCommand.newGuid());
    } else if (argv.type === 'string') {
        return console.log(RandomCommand.randomString(argv.length));
    }
}

var UUID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

var RandomCommand = exports.RandomCommand = function () {
    function RandomCommand() {
        _classCallCheck(this, RandomCommand);
    }

    _createClass(RandomCommand, null, [{
        key: 'randomInt',
        value: function randomInt(min, max) {
            return Math.floor(Math.random() * max) + min;
        }

        /**
         *
         * @param {number=} length
         * @return {string}
         */

    }, {
        key: 'randomHex',
        value: function randomHex(length) {
            length = length || 16;
            return new Buffer(RandomCommand.randomString(length)).toString('hex');
        }

        /**
         *
         * @param {number=} length
         * @return {string}
         */

    }, {
        key: 'randomString',
        value: function randomString(length) {
            length = length || 16;
            var chars = "abcdefghkmnopqursuvwxz2456789ABCDEFHJKLMNPQURSTUVWXYZ";
            var str = "";
            for (var i = 0; i < length; i++) {
                str += chars.substr(RandomCommand.randomInt(0, chars.length - 1), 1);
            }
            return str;
        }

        /**
         *
         * @return {string}
         */

    }, {
        key: 'newGuid',
        value: function newGuid() {
            var chars = UUID_CHARS,
                uuid = [],
                i = void 0;
            // rfc4122, version 4 form
            var r = void 0;
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
                }
            }
            return uuid.join('');
        }
    }]);

    return RandomCommand;
}();
//# sourceMappingURL=random.js.map
