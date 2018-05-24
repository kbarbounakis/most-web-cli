'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleDataContext = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.writeFileFromTemplate = writeFileFromTemplate;
exports.loadConfiguration = loadConfiguration;
exports.getConfiguration = getConfiguration;
exports.getDataConfiguration = getDataConfiguration;
exports.getBuilder = getBuilder;
exports.getHttpApplication = getHttpApplication;

var _lodash = require('lodash');

var _ = _interopRequireDefault(_lodash).default;

var _ejs = require('ejs');

var ejs = _interopRequireDefault(_ejs).default;

var _fsExtra = require('fs-extra');

var fs = _interopRequireDefault(_fsExtra).default;

var _path = require('path');

var path = _interopRequireDefault(_path).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var configurationDefaults = {
    "base": "server",
    "out": "dist/server"
};

/**
 *
 * @param s
 * @returns {*}
 * @private
 */
function _dasherize(s) {
    if (_.isString(s)) return _.trim(s).replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').replace(/^-/, '').toLowerCase();
    return s;
}

/**
 * @method dasherize
 * @memberOf _
 */
if (typeof _.dasherize !== 'function') {
    _.mixin({ 'dasherize': _dasherize });
}

function writeFileFromTemplate(source, dest, data) {
    return ejs.renderFile(source, data).then(function (res) {
        return new Promise(function (resolve, reject) {
            //write file
            fs.writeFile(dest, res, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
}

function loadConfiguration() {
    var config = require(path.resolve(process.cwd(), '.themost-cli.json'));
    return Object.assign({}, configurationDefaults, config);
}

function getConfiguration() {
    try {
        return loadConfiguration();
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error('ERROR', 'Configuration cannot be found. It seems that current working directory does not contain a MOST Web Framework project.');
            process.exit(1);
        } else {
            console.error('ERROR', 'An error occurred while loading configuration.');
            console.error(err);
            process.exit(1);
        }
    }
}

var SimpleDataContext = exports.SimpleDataContext = function () {
    function SimpleDataContext(configuration) {
        _classCallCheck(this, SimpleDataContext);

        this.getConfiguration = function () {
            return configuration;
        };
    }

    _createClass(SimpleDataContext, [{
        key: 'getStrategy',
        value: function getStrategy(strategyCtor) {
            return this.getConfiguration().getStrategy(strategyCtor);
        }
    }, {
        key: 'model',
        value: function model(name) {
            var self = this;
            if (name === null || name === undefined) return null;
            var obj = self.getConfiguration().getStrategy(function DataConfigurationStrategy() {}).model(name);
            if (_.isNil(obj)) return null;
            //do some things for CLI only
            //remove class path if any
            delete obj.classPath;
            //clear event listeners
            obj.eventListeners = [];
            var dataModule = require.resolve('@themost/data/data-model', {
                paths: [path.resolve(process.cwd(), 'node_modules')]
            });
            var DataModel = require(dataModule).DataModel,
                model = new DataModel(obj);
            //set model context
            model.context = self;
            //return model
            return model;
        }
    }]);

    return SimpleDataContext;
}();

function getDataConfiguration(options) {
    var DataConfiguration = void 0;
    try {
        var dataModule = require.resolve('@themost/data/data-configuration', {
            paths: [path.resolve(process.cwd(), 'node_modules')]
        });
        DataConfiguration = require(dataModule).DataConfiguration;
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error('ERROR', 'MOST Web Framework data configuration module cannot be found.');
        } else {
            console.error('ERROR', 'An error occurred while trying to initialize data configuration.');
            console.error(err);
        }
        return process.exit(1);
    }
    console.log('INFO', 'Initializing configuration');
    return new DataConfiguration(path.resolve(process.cwd(), options.base, 'config'));
}

function getBuilder(config) {
    var ODataConventionModelBuilder = void 0;
    var dataModule = require.resolve('@themost/data/odata', {
        paths: [path.resolve(process.cwd(), 'node_modules')]
    });
    ODataConventionModelBuilder = require(dataModule).ODataConventionModelBuilder;

    var dataObjectModule = require.resolve('@themost/data/data-object', {
        paths: [path.resolve(process.cwd(), 'node_modules')]
    });
    //disable data model class loader
    config.getStrategy(function ModelClassLoaderStrategy() {}).resolve = function (model) {
        return require(dataObjectModule).DataObject;
    };
    return new ODataConventionModelBuilder(config);
}

function getHttpApplication(options) {
    var HttpApplication = void 0;
    try {
        var appModule = require.resolve('@themost/web/app', {
            paths: [path.resolve(process.cwd(), 'node_modules')]
        });
        HttpApplication = require(appModule).HttpApplication;
    } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            console.error('ERROR', 'MOST Web Framework module cannot be found.');
        } else {
            console.error('ERROR', 'An error occurred while trying to initialize MOST Web Framework Application.');
            console.error(err);
        }
        return process.exit(1);
    }
    console.log('INFO', 'Initializing application');
    var app = new HttpApplication(path.resolve(process.cwd(), options.out));
    var strategy = app.getConfiguration().getStrategy(function DataConfigurationStrategy() {});
    //get adapter types
    var adapterTypes = strategy.adapterTypes;
    //get configuration adapter types
    var configurationAdapterTypes = app.getConfiguration().getSourceAt('adapterTypes');
    if (Array.isArray(configurationAdapterTypes)) {
        configurationAdapterTypes.forEach(function (configurationAdapterType) {
            if (typeof adapterTypes[configurationAdapterType.invariantName] === 'undefined') {
                //load adapter type
                var adapterModulePath = require.resolve(configurationAdapterType.type, {
                    paths: [path.resolve(process.cwd(), 'node_modules')]
                });
                var adapterModule = require(adapterModulePath);
                adapterTypes[configurationAdapterType.invariantName] = {
                    invariantName: configurationAdapterType.invariantName,
                    name: configurationAdapterType.name,
                    createInstance: adapterModule.createInstance
                };
            }
        });
    }
    return app;
}
//# sourceMappingURL=util.js.map
