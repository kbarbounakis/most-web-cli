import _ from 'lodash';
import ejs from 'ejs';
import fs from 'fs-extra';
import path from 'path';

const configurationDefaults = {
                "base":"server",
                "out": "dist/server"
            };

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

export function loadConfiguration() {
    let config = require(path.resolve(process.cwd(), '.themost-cli.json'));
    return Object.assign({}, configurationDefaults, config);
}

export function getConfiguration() {
    try {
        return loadConfiguration();
    }
    catch(err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error('ERROR','Configuration cannot be found. It seems that current working directory does not contain a MOST Web Framework project.');
            process.exit(1);
        }
        else {
            console.error('ERROR','An error occurred while loading configuration.');
            console.error(err);
            process.exit(1);
        }
    }
}
