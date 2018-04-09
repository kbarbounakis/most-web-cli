'use strict';

var _path = require('path');

var path = _interopRequireDefault(_path).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('yargs').commandDir(path.resolve(__dirname, 'commands')).demandCommand().help().argv; /**
                                                                                               * @license
                                                                                               * MOST Web Framework 2.0 Codename Blueshift
                                                                                               * Copyright (c) 2017, THEMOST LP All rights reserved
                                                                                               *
                                                                                               * Use of this source code is governed by an BSD-3-Clause license that can be
                                                                                               * found in the LICENSE file at https://themost.io/license
                                                                                               */
//# sourceMappingURL=cli.js.map
