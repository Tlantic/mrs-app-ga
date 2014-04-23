/*! MRS.GoogleAnalytics - v0.0.1 - 2014-04-23 */
/**
	The MRS GoogleAnalytics module is a proxy to Google Analytics service, provided to analyse and track page changes and events on your web app.

	There is no dependency of MRS.Core. That means that it can be installed on every environment.
	Just be aware that it has a strong dependency on analytics.js file, provided by Google. Everytime this script changes, you need to update this module.

	@module MRS.GoogleAnalytics
	@beta
**/

angular.module('MRS.GoogleAnalytics', []);
/**
    Provider to provide data fetching for category entity/concept.
    
    @class GAnalytics
    @namespace MRS.GoogleAnalytics
    @since 0.4.1
**/
angular.module("MRS.GoogleAnalytics").service('GAnalytics', ['$mrsgoogleanalyticsConfig', '$window', '$location',
    function($config, $window, $location) {
        var self = this;

        var debug = $config.debug,
            _TAG = 'MRS.GoogleAnalytics: ';

        var created = false,
            trackRoutes = $config.trackRoutes,
            accountId = $config.accountId,
            trackPrefix = $config.trackPrefix,
            pageEvents = $config.pageEvents,
            cookieConfig = {
                "storage": "none",
                "clientId": "device.uuid"
            },
            ecommerce = $config.ecommerce.active,
            ecommerce_currency = $config.ecommerce.currency,
            enhancedLinkAttribution = $config.enhancedLinkAttribution,
            removeRegExp,
            experimentId,
            ignoreFirstPageLoad = $config.ignoreFirstPageLoad,
            ganalyticsScript = $config.scriptPath;

        // Logs
        this._logs = [];

        this.getUrl = function getUrl() {
            var url = $location.path();
            if (removeRegExp)
                return url.replace(removeRegExp, '');
            return url;
        };

        this.log = function log() {
            if (!debug)
                return;
            console.info(_TAG + 'Log:', arguments);
        };

        /**
            Track a new page.
            Send "pageview" event to GA.
            @method trackPage
            @param {String} url
        */
        this.trackPage = function trackPage(url) {
            if (!$window.ga)
                return;
            $window.ga('send', 'pageview', trackPrefix + url);
            this.log('pageview', arguments);
        };

        /**
            Send "event" event to GA.
            @method trackEvent
            @param {String} category
            @param {String} action
            @param {String} label
            @param {String} value
        */
        this.trackEvent = function trackEvent(category, action, label, value) {
            if (!$window.ga)
                return;
            $window.ga('send', 'event', category, action, label, value);
            this.log('event', arguments);
        };

        /**
          Add transaction
          https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addTrans
          @method addTrans
          @param {String} transactionId
          @param {String} affiliation
          @param {String} total
          @param {String} tax
          @param {String} shipping
          @param {String} city
          @param {String} state
          @param {String} country
          @private
        */
        this.addTrans = function addTrans(transactionId, affiliation, total, tax, shipping, city, state, country, currency) {
            if (!$window.ga)
                return;
            if (!ecommerce) {
                console.warn(_TAG + 'ecommerce no set. Use AnalyticsProvider.setECommerce(true);');
                return;
            }
            $window.ga('ecommerce:addTransaction', {
                id: transactionId,
                affiliation: affiliation,
                revenue: total,
                tax: tax,
                shipping: shipping,
                currency: currency || ecommerce_currency
            });
            this.log('ecommerce:addTransaction', arguments);
        };

        /**
            Add item to transaction
            https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#addItem
            @method addItem
            @param {String} transactionId
            @param {String} sku
            @param {String} name
            @param {String} category
            @param {String} price
            @param {String} quantity
            @private
        */
        this.addItem = function addItem(transactionId, sku, name, category, price, quantity) {
            if (!$window.ga)
                return;
            $window.ga('ecommerce:addItem', {
                id: transactionId,
                name: name,
                sku: sku,
                category: category,
                price: price,
                quantity: quantity
            });
            this.log('ecommerce:addItem', arguments);
        };

        /**
            Track transaction
            https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#sendingData
            @method trackTrans
            @private
        */
        this.trackTrans = function trackTrans() {
            if (!$window.ga)
                return;
            $window.ga('ecommerce:send');
            this.log('ecommerce:send', arguments);
        };

        /**
            Clear transaction
            https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce#clearingData
            @method clearTrans
            @private
        */
        this._clearTrans = function clearTrans() {
            if (!$window.ga)
                return;
            $window.ga('ecommerce:clear');
            this.log('ecommerce:clear', arguments);
        };

        /**
            Send custom events
            https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings#implementation
            https://developers.google.com/analytics/devguides/collection/analyticsjs/social-interactions#implementation
            @method send
            @param {Object} obj
            @private
        */
        this.send = function send(obj) {
            if (!$window.ga)
                return;
            $window.ga('send', obj);
            this.log('send', obj);
        };


        var _installScript = function _installScript() {
            if (!accountId)
                return console.warn(_TAG + 'No account id set for Analytics.js');
            if (!ganalyticsScript)
                return console.warn(_TAG + 'Analytics.js not defined');

            /* jshint ignore:start */
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments);
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(window, document, 'script', ganalyticsScript, 'ga');
            /* jshint ignore:end */

            $window.ga('create', accountId, cookieConfig);

            if (trackRoutes && !ignoreFirstPageLoad) {
                $window.ga('send', 'pageview', self.getUrl());
            }
            if (ecommerce) {
                $window.ga('require', 'ecommerce', 'ecommerce.js');
            }
            if (enhancedLinkAttribution) {
                $window.ga('require', 'linkid', 'linkid.js');
            }
            if (experimentId) {
                var expScript = document.createElement('script'),
                    s = document.getElementsByTagName('script')[0];
                expScript.src = "//www.google-analytics.com/cx/api.js?experiment=" + experimentId;
                s.parentNode.insertBefore(expScript, s);
            }
        };

        var _init = function _init() {
            // Install script on page
            _installScript();
            // Activate route handling for every pages
            if (trackRoutes) {
                var trackRoutesHandler = function trackRoutesHandler() {
                    self.trackPage(self.getUrl());
                };
                for (var i = 0; i < pageEvents.lenght; i++)
                    $rootScope.$on(pageEvents[i], trackRoutesHandler);
            }
        };

        _init();
    }
]);