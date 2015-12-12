/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 20/11/2014.
 */

var util = require('util'),
    fs = require('fs'),
    web = require('most-web'),
    path = require('path');

/**
 * Root HTTP Controller class
 * @constructor
 * @augments {HttpController}
 */
function RootController() {
    //
}
util.inherits(RootController, web.controllers.HttpBaseController);

RootController.prototype.index = function(callback)
{
    callback(null, this.view());
};

function return_() {
    return this.context.params.attr('returnUrl') || this.context.params.attr('returnUrl') || '/';
}

RootController.prototype.login = function(callback)
{
    var self = this;
    try {
        self.context.handle('GET', function() {
            return callback(null, this.view());
        }).handle('POST', function() {
            try {
                //validate anti-forgery token
                self.context.validateAntiForgeryToken();
                //try to login
                var credentials = self.context.params.credentials;
                //get auth service
                var auth = self.context.application.service('$auth')(self.context);
                auth.login(credentials.username, credentials.password, function(err) {

                });
            }
            catch(err) {
                return callback(err);
            }
        }).unhandle(function() {
            return callback(new web.common.HttpMethodNotAllowed());
        });
    }
    catch(err) {
        return callback(err);
    }
};

RootController.prototype.logout = function(callback)
{
    var self = this;
    try {
        self.context.application.setAuthCookie(self.context, 'anonymous');
        return callback(null, self.redirect(return_.call(self)));
    }
    catch(err) {
        return callback(err);
    }

};

if (typeof module !== 'undefined') module.exports = RootController;
