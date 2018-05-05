'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeFileFromTemplate = writeFileFromTemplate;
exports.loadConfiguration = loadConfiguration;
exports.getConfiguration = getConfiguration;
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
