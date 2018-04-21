import _ from 'lodash';
import ejs from 'ejs';
import fs from 'fs-extra';
/**
 *
 * @param s
 * @returns {*}
 * @private
 */
function _dasherize(s) {
    if (_.isString(s))
        return _.trim(s).replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').replace(/^-/,'').toLowerCase();
    return s;
}

/**
 * @method dasherize
 * @memberOf _
 */
if (typeof _.dasherize !== 'function') {
    _.mixin({'dasherize' : _dasherize});
}

export function writeFileFromTemplate(source, dest, data) {
    return ejs.renderFile(source, data).then((res)=> {
        return new Promise((resolve, reject)=> {
            //write file
            fs.writeFile(dest, res, (err) => {
              if (err) {
                    return reject(err);
              }
              return resolve();
            });
        });
        
    });
}
