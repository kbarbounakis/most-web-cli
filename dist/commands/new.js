'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.desc = exports.command = undefined;
exports.builder = builder;
exports.handler = handler;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var command = exports.command = 'new <command>'; /**
                                                  * @license
                                                  * MOST Web Framework 2.0 Codename Blueshift
                                                  * Copyright (c) 2017, THEMOST LP All rights reserved
                                                  *
                                                  * Use of this source code is governed by an BSD-3-Clause license that can be
                                                  * found in the LICENSE file at https://themost.io/license
                                                  */
var desc = exports.desc = 'Create a new component';

function builder(yargs) {
  return yargs.commandDir(path.resolve(__dirname, 'new_commands'));
}

function handler() {}
//# sourceMappingURL=new.js.map
