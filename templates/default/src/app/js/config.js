/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 10/12/2014.
 * Require JS configuration
 */

require.config({
    baseUrl:'/js/',
    paths: {
        'domReady':'domReady.min',
        'moment':'moment.min',
        'es6':'es6.min',
        'angular': 'angular.min',
        'angular-route': 'angular-route.min',
        'xml': 'most-xml.min',
        'parsley':'parsley.min',
        'bootstrap':'bootstrap.min',
        'jquery':'jquery.min',
        'directives':'directives',
        'filters':'filters',
        'controllers':'controllers',
        'app':'app',
        'angular-animate': 'angular-animate.min',
        'angular-aria': 'angular-aria.min',
        'jquery-easing':'jquery.easing.min'
    },
    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        "domReady": {
            exports: "domReady"
        },
        "jquery": {
            exports: "jquery"
        },
        "moment": {
            exports: "moment"
        },
        "xml": {
            exports: "xml"
        },
        "jquery-easing": {
            deps :[ "jquery" ]
        },
        "parsley": {
            exports: "parsley"
        },
        "bootstrap": {
            exports: "bootstrap",
            deps :[ "jquery" ]
        },
        "angular": {
            exports: "angular",
            deps :[ "jquery" ]
        },
        "angular-route": {
            deps: ["angular"]
        },
        "angular-animate": {
            exports: "angular-animate",
            deps: ["jquery", "angular"]
        },
        "angular-aria": {
            exports: "angular-aria",
            deps: ["jquery", "angular"]
        },
        "directives": {
            deps: ["angular"]
        },
        "controllers": {
            deps: ["angular", "angular-route" ]
        },
        "filters": {
            deps: ["angular", "angular-route" ]
        },
        "app" : {
            deps :[ "controllers", "directives", "filters" ]
        }
    },
    deps: [
        "es6", "bootstrap", "jquery-easing"
    ]
});