/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 24/11/2014.
 */
var util = require("util"), path=require("path"), fs = require("fs");

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    /**
     * @param {*} options
     * @param {function(Error=,*=)} callback
     */
    module.exports.invoke = function(options, callback) {
        try {
            if (typeof options.model === 'undefined' || options.model===null) {
                callback(new Error("The target model cannot be empty at this context."));
                return;
            }
            var web = require("most-web");
            web.current.execute(function(context)
            {
                web.current.extend();
                //get arguments
                var file = options.input;
                if (typeof file === 'undefined' || typeof options.model === 'undefined') {
                    callback(new Error('Invalid arguments.'));
                }
                else {
                    var filePath = path.resolve(file), model = context.model(options.model);
                    if (typeof model === 'undefined' || model===null) {
                        callback(new Error('The specified model cannot be found.'));
                    }
                    else {
                        fs.exists(filePath, function(exists) {
                            if (!exists) {
                                callback(new Error('The specified file cannot be found.'));
                            }
                            else {
                                fs.readFile(filePath, 'utf8', function(err, data) {
                                    if (err) {
                                        callback(new Error('An error occurred while processing data file. ' + err.message));
                                    }
                                    else {
                                        var items = JSON.parse(data);
                                        model.save(items, function(err) {
                                            context.finalize(function() {
                                                if (err) {
                                                    callback(new Error('An error occurred while processing data items. ' + err.message));
                                                    if (err.stack) {
                                                        console.log(err.stack)
                                                    }
                                                }
                                                else {
                                                    callback();
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }

                }
            });
        }
        catch(e) {
            callback(e);
        }
    }
}