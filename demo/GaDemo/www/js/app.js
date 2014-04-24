/* global angular */
var app = angular.module('myapp', ['MRS.GoogleAnalytics']);

window.device = {uuid : "MY_CLIENT_ID"};

app.run(['GAnalytics', function (ga) {
    ga.trackPage('index.html');
    ga.trackEvent('TEST');
}]);
