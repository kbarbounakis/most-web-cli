'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeFileFromTemplate = writeFileFromTemplate;

var _lodash = require('lodash');

var _ = _interopRequireDefault(_lodash).default;

var _ejs = require('ejs');

var ejs = _interopRequireDefault(_ejs).default;

var _fsExtra = require('fs-extra');

var fs = _interopRequireDefault(_fsExtra).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @param s
 * @returns {*}
 * @private
 */
function _dasherize(s) {
    if (_.isString(s)) return _.trim(s).replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').replace(/^-/, '').toLowerCase();
    return s;
}

/**
 * @method dasherize
 * @memberOf _
 */
if (typeof _.dasherize !== 'function') {
    _.mixin({ 'dasherize': _dasherize });
}

function writeFileFromTemplate(source, dest, data) {
    return ejs.renderFile(source, data).then(function (res) {
        return new Promise(function (resolve, reject) {
            //write file
            fs.writeFile(dest, res, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
}
//# sourceMappingURL=util.js.map
