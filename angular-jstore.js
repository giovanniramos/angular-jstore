/*!
 * angular-jstore.js [v1.0.0]
 * https://github.com/giovanniramos/angular-jstore
 *
 * Copyright (c) 2016 Giovanni Ramos
 * Licensed under the MIT license:
 *   http://opensource.org/licenses/MIT
 */
; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD module
        define(['angular'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS module
        factory((typeof angular === 'undefined') ? require('angular') : angular);
        module.exports = 'angular-jstore';
    } else {
        // Browser global
        factory(root.angular);
    }
} (this, function (angular) {
    "use strict";

    /**
     * @ngdoc overview
     * @name angular-jstore
     * @description
     * The `angular-jstore` module provides a convenient wrapper for to storing data in HTML5 localStorage, in the client browser. 
     */
    var jstore = angular.module('angular-jstore', []);

    /**
     * @ngdoc provider
     * @name angular-jstore.$jstore
     * */
    jstore.provider('$jstore', function $jstoreProvider() {
        // Default prefix
        var _prefix = 'jstore-';

        // Setter for the prefix
        // e.g. $jstoreProvider.setPrefix('yourAppName');        
        this.setPrefix = function(prefix) {
            if (typeof prefix !== 'string')
                throw new TypeError('[angular-jstore] - $jstoreProvider.setPrefix() expects a String.');

            _prefix = prefix;
            return this;
        };

        /**
         * @ngdoc service
         * @name $jstore
         * 
         * @example
         *
         * ```js
         * angular.module('appExample', ['angular-jstore'])
         *   .controller('ExampleController', ['$jstore', function($jstore) {
         *     // Session name
         *     var SESSION_NAME = "SessionTest";
         *     // Add data in session localStorage
         *     $jstore.set(SESSION_NAME, { year: "2015" });
         *     // Recover data from session
         *     var data = $jstore.get(SESSION_NAME);
         *   }]);
         * ```
         */
        this.$get = function () {

            // Check browser support
            var _checkBrowserSupport = function (obj, src) {
                return (typeof (Storage) !== "undefined") ? true : false;
            };

            // Remove duplicate prefix
            var _removeDuplicatePrefix = function (key) {
                return key.replace(new RegExp('^' + _prefix, 'g'), '');
            };

            return {
                /**
                 * @ngdoc method
                 * @name $jstore#set
                 *
                 * @description
                 * Add session localStorage
                 *
                 * @param {string} key Id for the `value`.
                 * @param {Object} val JSON value to be stored.
                 */
                set: function (key, val) {
                    _checkBrowserSupport();
                    if (val === undefined)
                        throw new TypeError('[angular-jstore] This session variable "' + key + '" contains an undefined value.');

                    var key = _prefix + key;
                    var obj = this.get(key);
                    return localStorage.setItem(key, angular.toJson(obj == null ? val : angular.merge(obj, val)));
                },

                /**
                 * @ngdoc method
                 * @name $jstore#get
                 *
                 * @description
                 * Get session localStorage
                 *
                 * @param {string} key Id to use for lookup.
                 * @returns {Object} Returns the deserialized value.
                 */
                get: function (key) {
                    _checkBrowserSupport();
                    var key = _removeDuplicatePrefix(_prefix + key);
                    var val = localStorage.getItem(key);
                    return (val !== "undefined") ? angular.fromJson(val) : null;
                },

                /**
                 * @ngdoc method
                 * @name $jstore#has
                 *
                 * @description
                 * Checks the a session exists in localStorage.
                 *
                 * @param {string} key Id to use for lookup.
                 * @returns {Object} Deserialized value.
                 */
                has: function (key) {
                    _checkBrowserSupport();
                    if (typeof key !== 'string')
                        throw new TypeError('[angular-jstore] - $jstore.has() expects a String.');

                    return this.get(key) !== null ? true : false; 
                },
                
                /**
                 * @ngdoc method
                 * @name $jstore#count
                 *
                 * @description
                 * Count the total of sessions created in localStorage.
                 *
                 * @returns {number} Total of elements in localStorage.
                 */
                count: function () {
                    _checkBrowserSupport();
                    return localStorage.length;
                },

                /**
                 * @ngdoc method
                 * @name $jstore#each
                 *
                 * @description
                 * Iterate over all sessions created in localStorage.
                 *
                 * @param {Function} callback The callback function. 
                 */
                each: function (callback) {
                    _checkBrowserSupport();
                    for (var i = 0; i < this.count(); i++) {
                        var key = localStorage.key(i)
                        callback(key, this.get(key))
                    }
                },

                /**
                 * @ngdoc method
                 * @name $jstore#remove
                 *
                 * @description
                 * Remove the session.
                 *
                 * @param {string} key Id of the key-value pair to delete.
                 */
                remove: function (key) {
                    _checkBrowserSupport();
                    var key = _removeDuplicatePrefix(_prefix + key);
                    localStorage.removeItem(key);
                },

                /**
                 * @ngdoc method
                 * @name $jstore#clear
                 *
                 * @description
                 * Clear all sessions in localStorage.
                 */
                clear: function () {
                    _checkBrowserSupport();
                    localStorage.clear();
                }
            };
        };
        
    });

    return jstore;
}));