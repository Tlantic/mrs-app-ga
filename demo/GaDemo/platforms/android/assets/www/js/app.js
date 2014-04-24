/* global angular */
var app = angular.module('myapp', ['MRS.GoogleAnalytics']);

app.run(['GAnalytics', function (ga) {
    ga.init({
        "storage": "none",
        "clientId": "device.uuid"
    });
    ga.trackPage('index.html');
    ga.trackEvent('TEST');
}]);
