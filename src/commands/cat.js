/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2017, THEMOST LP All rights reserved
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import {getConfiguration, getHttpApplication} from '../util';

const QUERY_OPTS = ['filter', 'expand', 'order', 'group', 'top', 'skip', 'count', 'select'];

export const command = 'cat <model> [options]';

export const desc = 'Query data';

export function builder(yargs) {
    return yargs.option('model', {
        describe:'the target model'
    }).option('dev', {
        default: false,
        describe: 'enables development mode'
    }).option('filter', {
        default: null,
        describe: 'defines query filter'
    }).option('expand', {
        default: null,
        describe: 'defines query expand option'
    }).option('group', {
        default: null,
        describe: 'defines query group by option'
    }).option('top', {
        default: 25,
        describe: 'defines query top option'
    }).option('skip', {
        default: 0,
        describe: 'defines query skip option'
    }).option('count', {
        default: false,
        describe: 'defines query count option'
    }).option('select', {
        default: null,
        describe: 'defines query select option'
    }).option('order', {
        default: null,
        describe: 'defines query order by option'
    });
}

export function handler(argv) {
    let options = getConfiguration();
    if (typeof argv.model === 'undefined' || argv.model === null) {
        console.error('ERROR','The target cannot be empty');
        process.exit(1);
    }
    if (argv.dev) {
        //set development mode
        process.env.NODE_ENV='development';
    }
    let app = getHttpApplication(options);
    app.execute((context)=> {
        try {
            let model = context.model(argv.model);
            if (typeof model === 'undefined' || model === null) {
                console.error('ERROR','Target model cannot be found.');
               return process.exit(1);
            }
            let query={};
            QUERY_OPTS.forEach((x)=> {
                if (argv.hasOwnProperty(x) && argv[x]) {
                    query[`$${x}`] = argv[x];
                }
            });
            //build query options
            model.filter(query, (err, q)=> {
                if (err) {
                    console.error('ERROR','An error occurred while applying query.');
                        console.error(err);
                        return process.exit(1);
                }
                
                let source = argv.count ? q.silent().getList() : q.silent().getItems();
                return source.then((res)=> {
                        if (res) {
                            if (argv.top === 1 && !argv.count) {
                                console.log(JSON.stringify(res[0],null,4));
                            }
                            else {
                                console.log(JSON.stringify(res,null,4));
                            }
                        }
                        process.exit(0);
                    }).catch((err)=> {
                        console.error('ERROR','An error occurred while querying data.');
                        console.error(err);
                        return process.exit(1);
                    });
                
            });
        }
        catch(err) {
            console.error('ERROR','An error occurred while getting data.');
            console.error(err);
            process.exit(1);
        }
       
    });
}