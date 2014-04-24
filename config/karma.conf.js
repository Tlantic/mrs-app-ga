/*global module */
module.exports = function (config) {
    'use strict';

    config.set({
        basePath : '../',
        logLevel: config.LOG_WARN,

        files: [
            'test/lib/angular/angular.js',
            'test/lib/angular/angular-mocks.js',
            'src/*.js',
            'test/lib/sinon/sinon-server-1.7.3.js',
            'test/lib/sinon/sinon-1.7.3.js',
            'test/unit/constants.js',
            'test/unit/test.*.js'
        ],

        autoWatch: true,
        singleRun: true,
        reportSlowerThan: 500,
        frameworks: ['jasmine'],
        browsers: ['PhantomJS'],
        plugins : [
            'karma-coverage',
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-jasmine',
        ],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/*.js': ['coverage']
        },
        junitReporter: {
            outputFile: 'test/result/test-results.xml',
            suite: 'unit'
        },
        coverageReporter: {
            type: 'html',
            dir: 'test/result/coverage/'
        }



    });
};