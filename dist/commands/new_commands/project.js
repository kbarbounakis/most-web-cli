'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.builder = exports.desc = exports.command = undefined;
exports.handler = handler;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

var _fs = require('fs');

var fs = _interopRequireDefault(_fs).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
var command = exports.command = 'project <directory>';

var desc = exports.desc = 'Create a new project';

var builder = exports.builder = {};

function handler(argv) {
    var projectRoot = path.resolve(argv.directory);
    if (fs.existsSync(projectRoot) && fs.readdirSync(projectRoot).length > 0) {
        return console.error('ERROR: Project root directory cannot be empty.');
    }
    console.log('Creating new project  at %s', projectRoot);
}
//# sourceMappingURL=project.js.map
