/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import path from 'path';
import fs from 'fs-extra';
import _ from 'lodash';
import {writeFileFromTemplate} from '../../util';

export const command = 'listener <name>';

export const desc = 'Generate a new data model listener';

export const builder = {
};

export function handler(argv) {
    //validating listener name
    if (!/^[a-zA-Z0-9_-]+$/.test(argv.name)) {
        console.error('ERROR','Listener name is not valid. Expected only latin characters, numbers or "_,-" characters.');
        return process.exit(1);
    }
    //get listener file name
    let destFile = _.dasherize(argv.name).concat('-listener.js');
    console.log('INFO',`Generating listener ${destFile}`);
    let destPath = path.resolve(process.cwd(), `server/listeners/${destFile}`);
    console.log('INFO',`Validating listener path ${destPath}`);
    if (fs.existsSync(destPath)) {
        console.error('ERROR','The specified listener already exists.');
        return process.exit(1);
    }
    //get template file path
    let templateFile = path.resolve(__dirname,'../../../templates/generate/listener.js.ejs');
    
    //get destination folder path
    let destFolder = path.dirname(destPath);
    console.error('INFO',`Validating listener folder (${destFolder}).`);
    fs.ensureDir(destFolder, (err)=> {
       if (err) {
           console.error('ERROR','An error occurred while validating destination path.');
            console.error(err);
       } 
       writeFileFromTemplate(templateFile, destPath, {
            name:_.upperFirst(_.camelCase(argv.name))
        }).then(()=> {
            console.log('INFO','The operation was completed succesfully.');
              return process.exit(0);
        }).catch((err)=> {
            console.error('ERROR','An error occurred while generating listener.');
            console.error(err);
            return process.exit(1);
        });
       
    });
    
    
    
}