/*global angular*/

/**
	The MRS App GoogleAnalytics module is a proxy to Google Analytics service, provided to analyse and track page changes and events on your web app.

	There is no dependency of MRS.App.Core. That means that it can be installed on every environment.
	Just be aware that it has a strong dependency on analytics.js file, provided by Google. Everytime this script changes, you need to update this module.

	@module MRS.App.GoogleAnalytics
**/

angular.module('MRS.App.GoogleAnalytics', [])

.config(['$mrsappgoogleanalytics', function (config) {
	'use strict';
    
    var defaultConfig = {
        trackRoutes: true,
		accountId: "",
		trackPrefix: "",
		pageEvents: ["$routeChangeSuccess", "$stateChangeSuccess"],
		ecommerce: {
			active: false,
			currency: "USD"
		},
		enhancedLinkAttribution: false,
		ignoreFirstPageLoad: true,
		scriptPath: ""
    };
	
	// merge config with default
    angular.extend(config, defaultConfig, config);
}]);