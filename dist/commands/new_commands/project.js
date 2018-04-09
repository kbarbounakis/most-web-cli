'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.builder = exports.desc = exports.command = undefined;
exports.handler = handler;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var command = exports.command = 'project <directory>'; /**
                                                        * @license
                                                        * MOST Web Framework 2.0 Codename Blueshift
                                                        * Copyright (c) 2017, THEMOST LP All rights reserved
                                                        *
                                                        * Use of this source code is governed by an BSD-3-Clause license that can be
                                                        * found in the LICENSE file at https://themost.io/license
                                                        */
var desc = exports.desc = 'Create a new project';

var builder = exports.builder = {};

function handler(argv) {
  console.log('creating new project  at %s', path.resolve(argv.directory));
}
//# sourceMappingURL=project.js.map
