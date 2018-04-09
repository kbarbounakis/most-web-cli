'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RandomCommand = exports.builder = exports.desc = exports.command = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.handler = handler;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var command = exports.command = 'random <type> [options]';

var desc = exports.desc = 'Create a new random string, integer or guid';

var builder = exports.builder = {
    type: {
        default: 'int'
    },
    min: {
        default: 0
    },
    max: {
        default: 1000000
    },
    length: {
        default: 8
    }
};

function handler(argv) {
    if (argv.type === 'int') {
        return console.log(RandomCommand.randomInt(argv.min, argv.max));
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
    }, {
        key: 'command',
        value: function command(yargs) {
            return yargs.usage('usage: <command> [options]').command('guid', 'create a random GUID string', function (yargs) {
                return RandomCommand.newGuid();
            }).command('string <length>', 'create a random string', function (yargs) {
                return RandomCommand.randomString(yargs.length);
            }).help('help').updateStrings({
                'Commands:': 'command:'
            }).wrap(null).argv;
        }
    }]);

    return RandomCommand;
}();
//# sourceMappingURL=random.js.map
