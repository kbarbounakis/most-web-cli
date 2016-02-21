/**
 * Created by kbarbounakis on 2/10/16.
 */

var mkdirp=require('mkdirp'),
    path = require('path'),
    async = require('async'),
    fs = require("fs"),
    path = require("path"),
    S = require("string");

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    /**
     * @param {*} options
     * @param {function(Error=,*=)} callback
     */
    module.exports.invoke = function(options, callback) {
        //apply defaults
        options = options || {};
        fs.readFile(path.resolve(__dirname, "base-controller-class/code.js.template"), "utf8",function(err, result) {
            if (err) { return callback(err); }
            var name = options.name || "Test";
            result = result.replace(/\$\{Controller}/g, name);
            //append file
            var file = S(name).dasherize().replace(/^-/,"") + "-controller.js";
            fs.exists(path.join(process.cwd(),"controllers", file), function(exists) {
                if (exists) {
                    return callback(new Error("The specified controller already exists."));
                }
                mkdirp(path.join(process.cwd(),"controllers"), function(err) {
                   if (err) { return callback(err); }
                    fs.writeFile(path.join(process.cwd(),"controllers", file), result, function(err) {
                        return callback(err);
                    });
                });
            });
        });

    };
    module.exports.options = function() {
        var program = require('commander'),
            version = require('./../package.json').version;
        //noinspection JSCheckFunctionSignatures
        return program.version(version).allowUnknownOption()
            .option("-o, --operation <value>", "Operation")
            .option("-n, --name <value>", "Name")
            .parse(process.argv);
    };
}