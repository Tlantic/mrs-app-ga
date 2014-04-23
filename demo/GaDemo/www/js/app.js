/* global angular */
var app = angular.module('myapp', ['MRS.GoogleAnalytics']);

app.service('$mrsgoogleanalyticsConfig', function () {
    angular.extend(this, {
        "module": "MRS.GoogleAnalytics",
        "trackRoutes": true,
        "accountId": "UA-50313432-2",
        "trackPrefix": "DemoTrack",
        "pageEvents": ["$routeChangeSuccess", "$stateChangeSuccess"],
        "cookieConfig": {
            "storage": "none",
            "clientId": "device.uuid"
        },
        "ecommerce": {
            "active": false,
            "currency": "USD"
        },
        "enhancedLinkAttribution": false,
        "ignoreFirstPageLoad": true,
        "scriptPath": "lib/analytics.js"
    });
});

app.run(['GAnalytics', function (ga) {
    
    ga.trackEvent('DemoTest', 'Run', 'MRS', 'Done!');
}]);
