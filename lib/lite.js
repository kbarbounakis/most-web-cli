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
 * @private
 */
var util = require('util'),
    async = require('async'),
    path = require("path"),
    fs = require("fs"),
    url = require('url'),
    http = require('http'),
    events = require('events'),
    crypto = require('crypto');

/**
 * @classdesc LiteEventEmitter class is an extension of node.js EventEmitter class where listeners are excuting in series.
 * @class
 * @augments EventEmitter
 * @constructor
 */
function LiteEventEmitter() {
    //
}
util.inherits(LiteEventEmitter, events.EventEmitter);
/**
 * Raises the specified event and executes event listeners in series.
 * @param {String} event - The event that is going to be raised.
 * @param {*} args - An object that contains the event arguments.
 * @param {Function} callback - A callback function to be invoked after the execution.
 */
LiteEventEmitter.prototype.emit = function(event, args, callback)
{
    var self = this;
    ////example: call super class function
    //LiteEventEmitter.super_.emit.call(this);
    //ensure callback
    callback = callback || function() {};
    //get listeners
    var listeners = this.listeners(event);
    //validate listeners
    if (listeners.length==0) {
        //exit emitter
        callback.call(self, null);
        return;
    }
    //apply each series
    async.applyEachSeries(listeners, args, function(err) {
        callback.call(self, err);
    });
};

LiteEventEmitter.prototype.once = function(type, listener) {
    var self = this;
    if (typeof listener !== 'function')
        throw TypeError('listener must be a function');
    var fired = false;
    function g() {
        self.removeListener(type, g);
        if (!fired) {
            fired = true;
            listener.apply(this, arguments);
        }
    }
    g.listener = listener;
    this.on(type, g);
    return this;
};

/**
 * Creates an instance of HttpContext class.
 * @class HttpLiteContext
 * @property {HttpLiteApplication} application - Gets or sets an instance of HttpApplication class which represents the application associated with this HTTP context.
 * @constructor
 * @param {ClientRequest} httpRequest
 * @param {ServerResponse} httpResponse
 * @augments EventEmitter
 */
function HttpLiteContext(httpRequest, httpResponse) {
    /**
     * @type {ClientRequest}
     */
    this.request = httpRequest;
    /**
     *
     * @type {ServerResponse}
     */
    this.response = httpResponse;
    /**
     *@type {HttpLiteApplication}
     */
    var application_;
    Object.defineProperty(this, 'application', {
        get: function () {
            return application_;
        },
        set: function (value) {
            application_ = value;
        }, configurable: false, enumerable: false
    });
}
util.inherits(HttpLiteContext, LiteEventEmitter);

/**
 * @class
 * @constructor
 * @augments EventEmitter
 */
function HttpLiteApplication() {
    this.executionPath = process.cwd();
    this.config = require("./lite/app.json");
    this.handlers = [];

    var self = this;
    self.config.handlers.forEach(function(h) {
        try {
            var handlerPath = h.type;
            if (handlerPath.indexOf('/')==0)
                handlerPath = self.mapPath(handlerPath);
            var handlerModule = require(handlerPath), handler = null;
            if (handlerModule) {
                if (typeof handlerModule.createInstance != 'function') {
                    console.log(util.format('The specified handler (%s) cannot be instantiated. The module does not export createInstance() function.', h.name));
                    return;
                }
                handler = handlerModule.createInstance();
                if (handler)
                    self.handlers.push(handler);
            }
        }
        catch (e) {
            throw new Error(util.format('The specified handler (%s) cannot be loaded. %s', h.name, e.message));
        }
    });
}
util.inherits(HttpLiteApplication, LiteEventEmitter);

HttpLiteApplication.prototype.mapPath = function (s) {
    var uri = url.parse(s).pathname;
    return path.join(this.executionPath, uri);
};

var HttpHandlerEvents = ['beginRequest', 'validateRequest', 'authenticateRequest',
    'authorizeRequest', 'mapRequest', 'postMapRequest', 'preExecuteResult', 'postExecuteResult', 'endRequest'];

/**
 * Creates an instance of HttpContext class.
 * @param {ClientRequest} request
 * @param {ServerResponse} response
 * @returns {HttpLiteContext}
 */
HttpLiteApplication.prototype.createContext = function (request, response) {
    var context = new HttpLiteContext(request, response);
    //set context application
    context.application = this;
    //set handler events
    for (var i = 0; i < HttpHandlerEvents.length; i++) {
        var ev = HttpHandlerEvents[i];
        for (var j = 0; j < this.handlers.length; j++) {
            var handler = this.handlers[j];
            if (typeof handler[ev] === 'function') {
                context.on(ev, handler[ev]);
            }

        }
    }
    return context;
};

/**
 *
 * @param {HttpLiteContext} context
 * @param {Function} callback
 */
HttpLiteApplication.prototype.processRequest = function (context, callback) {
    var self = this;
    if (typeof context === 'undefined' || context == null) {
        callback.call(self);
    }
    else {
        //1. beginRequest
        context.emit('beginRequest', context, function (err) {
            if (err) {
                callback.call(context, err);
            }
            else {
                //2. validateRequest
                context.emit('validateRequest', context, function (err) {
                    if (err) {
                        callback.call(context, err);
                    }
                    else {
                        //3. authenticateRequest
                        context.emit('authenticateRequest', context, function (err) {
                            if (err) {
                                callback.call(context, err);
                            }
                            else {
                                //4. authorizeRequest
                                context.emit('authorizeRequest', context, function (err) {
                                    if (err) {
                                        callback.call(context, err);
                                    }
                                    else {
                                        //5. mapRequest
                                        context.emit('mapRequest', context, function (err) {
                                            if (err) {
                                                callback.call(context, err);
                                            }
                                            else {
                                                //5b. postMapRequest
                                                context.emit('postMapRequest', context, function(err) {
                                                    if (err) {
                                                        callback.call(context, err);
                                                    }
                                                    else {
                                                        //process HEAD request
                                                        if (context.request.method==='HEAD') {
                                                            //7. endRequest
                                                            context.emit('endRequest', context, function (err) {
                                                                callback.call(context, err);
                                                            });
                                                        }
                                                        else {
                                                            //6. processRequest
                                                            if (context.request.currentHandler != null)
                                                                context.request.currentHandler.processRequest(context, function (err) {
                                                                    if (err) {
                                                                        callback.call(context, err);
                                                                    }
                                                                    else {
                                                                        //7. endRequest
                                                                        context.emit('endRequest', context, function (err) {
                                                                            callback.call(context, err);
                                                                        });
                                                                    }
                                                                });
                                                            else {
                                                                var er = new Error("Not Found");er.status = 404;
                                                                callback.call(context, er);
                                                            }
                                                        }

                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

/**
 *
 * @param {*} options
 */
HttpLiteApplication.prototype.start = function (options) {
    var self = this;


        //validate options
        var opts = {
            bind:options.bind || "0.0.0.0",
            port:options.port>0 ? options.port : 3000
        };
        self.config.settings.caching = options.cache;
        var rootDir = options.root;
        if (rootDir) {
            //validate path
            var stat = fs.statSync(path.resolve(process.cwd(),rootDir));
            if (!stat.isDirectory()) {
                throw new Error(util.format("The specified application directory (%s) cannot be found or is inaccesible.", rootDir));
            }
            this.executionPath = path.resolve(process.cwd(),rootDir);
        }

        self.on('error', function(event, callback) {
            if (typeof event.error === 'undefined' || event.error == null) {
                return callback();
            }
            if (event.context && event.context.response) {
                event.context.response.writeHead(event.error.status || 500, event.error.message);
                if (event.context.request.headers.accept && /text\/html/g.test(event.context.request.headers.accept)) {
                    event.context.response.end(util.format("<h1>%s %s</h1>", event.error.status || 500, event.error.message));
                }
            }
            return callback();
        });


        http.createServer(function (request, response) {
            try {
                var context = self.createContext(request, response);
                //begin request processing
                self.processRequest(context, function (err) {
                    try {
                        if (err) {
                            self.emit('error', { context:context, error:err }, function() {
                                if (context && context.response) { context.response.end(); }
                            });
                        }
                        else {
                            if (context && context.response) { context.response.end(); }
                        }
                    }
                    catch(er) {
                        console.log(er);
                    }

                });
            }
            catch(err) {
                if (context) {
                    self.emit('error', { context:context, error:err }, function() {
                        if (context && context.response) { context.response.end(); }
                    });
                }
                else {
                    console.log(err);
                }
            }

        }).listen(opts.port, opts.bind);
        console.log(util.format('Web application is running at http://%s:%s/', opts.bind, opts.port));

};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    /**
     * @param {*} options
     * @param {function(Error=,*=)} callback
     */
    module.exports.invoke = function(options, callback) {
        var app = new HttpLiteApplication();
        app.start(options);
    };
    module.exports.options = function() {
        var program = require('commander'),
            version = require('./../package.json').version;
        //noinspection JSCheckFunctionSignatures
        return program.version(version).allowUnknownOption()
            .option("-o, --operation <value>", "Operation")
            .option("-r, --root <value>", "Root Directory")
            .option("-p, --port <n>", "Port", parseInt, 3000)
            .option("-b, --bind <value>", "IP Address")
            .option("-c, --cache", "Caching")
            .parse(process.argv);
    };
}