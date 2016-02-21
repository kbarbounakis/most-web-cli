/**
 * MOST Web Framework
 * A JavaScript Web Framework
 * http://themost.io
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 2015-02-20.
 *
 * Copyright (c) 2016, Kyriakos Barbounakis k.barbounakis@gmail.com
 Anthi Oikonomou anthioikonomou@gmail.com
 All rights reserved.
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 * Neither the name of MOST Web Framework nor the names of its
 contributors may be used to endorse or promote products derived from
 this software without specific prior written permission.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * @ignore
 */
var fs = require('fs'),
    path = require("path"),
    url = require("url"),
    crypto = require('crypto');
/**
 * Static File Handler
 * @class
 * @constructor
 */
function LiteStaticHandler() {
    //
}

LiteStaticHandler.prototype.validateRequest = function(context, callback) {
    callback = callback || function() {};
    callback.call(context);
};

/*
 * Maps the current request handler with the underlying HTTP request.
 * */
LiteStaticHandler.prototype.mapRequest = function(context, callback)
{
    callback = callback || function() {};
    try {
        //get file path
        var uri = url.parse(context.request.url),
            filePath = context.application.mapPath(uri.pathname);
        fs.exists(filePath, function(exists) {
           if (!exists) {
               callback(null);
           }
           else {
               fs.stat(filePath, function(err, stats) {
                   if (err) {
                       callback(err);
                   }
                   else {
                       //if file exists
                       if (stats && stats.isFile()) {
                           //set request current handler
                           context.request.currentHandler = new LiteStaticHandler();
                           //set current execution path
                           context.request.currentExecutionPath = filePath;
                           //set file stats
                           context.request.currentExecutionFileStats = stats;
                           return callback();
                       }
                       else if (stats && stats.isDirectory()) {
                           //set current execution path
                           var indexPath = path.join(filePath, "index.html");
                           fs.stat(indexPath, function(err, stats) {
                               if (err) {
                                   if (err.code === 'ENOENT') {
                                       return callback();
                                   }
                               }
                               else {
                                   //set request current handler
                                   context.request.currentHandler = new LiteStaticHandler();
                                   //set current execution path
                                   context.request.currentExecutionPath = indexPath;
                                   //set file stats
                                   context.request.currentExecutionFileStats = stats;
                               }
                               return callback(err);
                           });
                       }
                   }
               });
           }
        });
    } catch (e) {
        callback(e);
    }
};

/*
LiteStaticHandler.prototype.preRequestHandlerExecute = function(context)
{
    //
};
*/

LiteStaticHandler.prototype.unmodifiedRequest = function(context, executionPath, callback) {
    try {
        var requestETag = context.request.headers['if-none-match'];
        if (typeof requestETag === 'undefined' || requestETag == null) {
            callback(null, false);
            return;
        }
        fs.exists(executionPath, function(exists) {
            try {
                if (exists) {
                    fs.stat(executionPath, function(err, stats) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            if (!stats.isFile()) {
                                callback(null, false);
                            }
                            else {
                                //validate if-none-match
                                var md5 = crypto.createHash('md5');
                                md5.update(stats.mtime.toString());
                                var responseETag = md5.digest('base64');
                                return callback(null, (requestETag==responseETag));
                            }
                        }
                    });
                }
                else {
                    callback(null, false);
                }
            }
            catch (e) {
                console.log(e);
                callback(null, false);
            }
        });
    }
    catch (e) {
        console.log(e);
        callback(null, false);
    }
};

LiteStaticHandler.prototype.preflightRequest = function(context, callback) {
    try {
        if (context && (context.request.currentHandler instanceof LiteStaticHandler)) {
            context.response.setHeader("Access-Control-Allow-Origin", "*");
            context.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Language, Accept, Accept-Language, Authorization");
            context.response.setHeader("Access-Control-Allow-Credentials", "true");
            context.response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        }
        return callback();
    }
    catch(e) {
        callback(e);
    }

};

LiteStaticHandler.prototype.postMapRequest = function(context, callback) {
    return LiteStaticHandler.prototype.preflightRequest.call(this, context, callback);
};

/**
 * @param {HttpLiteContext} context
 * @param {Function} callback
 */
LiteStaticHandler.prototype.processRequest = function(context, callback)
{
    callback = callback || function() {};
    try {
        if (context.request.method ==='OPTIONS') {
            //do nothing
            return callback();
        }
            //get current execution path and validate once again file presence and MIME type
        var stats = context.request.currentExecutionFileStats;
        if (typeof stats === 'undefined' || stats == null) {
            callback((function() {
                var er = new Error("Invalid Handler");er.status = 500;
                return er;
            })());
            return;
        }
        if (!stats.isFile()) {
            return callback((function() {
                var er = new Error("Not Found");er.status = 404;
                return er;
            })());
        }
        else {
            //get if-none-match header
            var requestETag = context.request.headers['if-none-match'];
            //generate responseETag
            var md5 = crypto.createHash('md5');
            md5.update(stats.mtime.toString());
            var responseETag = md5.digest('base64');
            if (requestETag)
                if (requestETag==responseETag) {
                    context.response.writeHead(304, { });
                    context.response.end();
                    return callback.call(context);
                }
            //get file extension
            var extensionName  = path.extname(context.request.currentExecutionPath);
            //get MIME collection
            var mimes = context.application.config.mimes;
            var contentType = null, contentEncoding=null;
            //find MIME type by extension
            var mime =mimes.filter(
                /**
                 * @param {{type:string,extension:string}} x
                 * @returns {boolean}
                 */
                function(x) { return x.extension==extensionName; })[0];
            if (mime) {
                contentType = mime.type;
                if (mime.encoding)
                    contentEncoding = mime.encoding;
            }
            //throw exception (MIME not found or access denied)
            if (contentType==null) {

                callback((function() {
                    var er = new Error("Forbidden");er.status = 403;
                    return er;
                })());
            }
            else {
                //create stream
                var source = fs.createReadStream(context.request.currentExecutionPath);
                //write headers
                context.response.writeHead(200, {'Content-Type': contentType + (contentEncoding ? ';charset=' + contentEncoding : ''), 'ETag' : responseETag});
                //response file
                source.pipe(context.response);
                //handle end
                source.on('end', function() {
                    callback();
                });
                //handle error
                source.on('error', function(err) {
                    callback(err);
                });
            }
        }
        }
        catch (e) {
        callback.call(context, e);
    }
};



if (typeof exports !== 'undefined') {
    module.exports = {
        LiteStaticHandler:LiteStaticHandler,
        createInstance : function() {
        return new LiteStaticHandler();
    }
    };
}


