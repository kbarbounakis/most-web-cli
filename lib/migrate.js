/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 24/11/2014.
 */
var util = require("util");

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
                var model = context.model(options.model);
                model.migrate(function(err)
                {
                    if (err) { callback(err); return; }
                    context.finalize(function() {
                        console.log(util.format('%s model migration was completed succesfully.', options.model));
                    });
                });
            });
        }
        catch(e) {
            callback(e);
        }
    };
    module.exports.options = function() {
        var program = require('commander'),
            version = require('./../package.json').version;
        //noinspection JSCheckFunctionSignatures
        return program.version(version).allowUnknownOption()
            .option("-o, --operation <value>", "Operation")
            .option("-m, --model <value>", "Model")
            .parse(process.argv);
    };
}