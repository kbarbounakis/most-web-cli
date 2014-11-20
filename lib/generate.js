/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */

var mkdirp=require('mkdirp'), path = require('path'), async = require('async'), fs = require("fs"), path = require("path");

function copyFolderContents(src, dest, callback) {
    fs.exists(src, function(exists) {
       if (!exists) {
           callback();
       }
        else {
           fs.exists(dest, function(exists) {
               if (!exists) {
                   try {
                       fs.mkdirSync(dest);
                   }
                   catch (e) {
                       callback(e);
                       return;
                   }
               }
               fs.readdir(src, function(err, files) {
                   if (err) {
                       callback(err);
                   }
                   else {
                        async.eachSeries(files, function(file, cb) {
                            if (file==='.' || file==='..') {
                                cb();
                            }
                            else {
                                fs.exists(path.join(dest, file), function(exists) {
                                    if (exists) {
                                        try {
                                            if (fs.statSync(path.join(dest, file)).isDirectory()) {
                                                copyFolderContents(path.join(src, file), path.join(dest, file), function(err) {
                                                    cb(err);
                                                });
                                            }
                                            else {
                                                cb();
                                            }
                                        }
                                        catch(e) {
                                            cb(e);
                                        }
                                    }
                                    else {
                                        fs.stat(path.join(src, file), function(err, stats) {
                                            if (err) {
                                                cb(err);
                                            }
                                            else {
                                                if (stats.isDirectory()) {
                                                    copyFolderContents(path.join(src, file), path.join(dest, file), function(err) {
                                                       cb(err);
                                                    });
                                                }
                                                else if (stats.isFile()) {
                                                    fs.readFile(path.join(src, file), null, function(err, data) {
                                                        if (err) {
                                                            cb(err);
                                                        }
                                                        else {
                                                            fs.writeFile(path.join(dest, file), data, '', function(err, result) {
                                                                cb(err);
                                                            });
                                                        }
                                                    });
                                                }
                                                else {
                                                    cb();
                                                }
                                            }
                                        });

                                    }
                                })
                            }
                        }, function(err) {
                            callback(err);
                        });
                   }
               });
           });

       }
    });
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    /**
     * @param {*} options
     * @param {function(Error=,*=)} callback
     */
    module.exports.invoke = function(options, callback) {
        //apply defaults
        options = options || {};
        callback = callback || function() {};
        async.series([
            /**
             * add template files
             */
            function(callback2) {
                copyFolderContents(path.join(__dirname, './../templates/default/src'), process.cwd(), callback2);
            }
        ], function(err) {
            callback(err);
        });


    }
}