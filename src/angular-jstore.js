; (function(root, factory) {
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
} (this, function(angular) {
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
        var _prefix = 'jstoreApp-';

        // Setter for the prefix
        // e.g. $jstoreProvider.setPrefix('myAppName');
        this.setPrefix = function(prefix) {
            if (typeof prefix !== 'string')
                throw new TypeError('$jstoreProvider.setPrefix() expects a String.');

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
         *     var SESSION_NAME = "MySessionName";
         *     // Add data in session localStorage
         *     $jstore.set(SESSION_NAME, { year: "2017" });
         *     // Recover data from session
         *     var data = $jstore.get(SESSION_NAME);
         *   }]);
         * ```
         */
        this.$get = [function() {

            // Check browser support
            var _checkBrowserSupport = function() {
                return (typeof (Storage) !== "undefined") ? true : false;
            };

            // Reduce prefix
            var _reducePrefix = function(id) {
                return id.replace(new RegExp('(' + _prefix + '){2,}', 'g'), _prefix);
            };

            return {
                /**
                 * @ngdoc property
                 * @name $jstore#isSupported
                 *
                 * @description
                 * Check browser support
                 *
                 * @return {Boolean} Returns true if Storage is supported.
                 */
                isSupported: _checkBrowserSupport(),

                /**
                 * @ngdoc method
                 * @name $jstore#set
                 *
                 * @description
                 * Stores a serialized object of key-value pair in session of the localStorage.
                 *
                 * @param {string} sId Id name of the session to be used for store.
                 * @param {Object} val JSON value to be stored.
                 */
                set: function(sId, val) {
                    if (typeof sId !== 'string') {
                        throw new TypeError('$jstore.set() expects a String but got a `' + (typeof sId) + '` as a first parameter.');
                    }

                    if (typeof val === 'string') {
                        throw new TypeError('$jstore.set() expects a JSON object instead of a string as a second parameter.');
                    } else if (typeof val !== 'object') {
                        throw new TypeError('$jstore.set() expects a JSON object as the second argument.');
                    }

                    var pid = _prefix + sId;
                    var obj = this.get(pid);

                    return localStorage.setItem(pid, angular.toJson(obj == null ? val : angular.merge(obj, val)));
                },

                /**
                 * @ngdoc method
                 * @name $jstore#get
                 *
                 * @description
                 * Gets a deserialized key-value pair object from the localStorage.
                 *
                 * @param {string} sId Id name of the session to use for lookup.
                 * @returns {Object} Returns the deserialized value.
                 */
                get: function(sId) {
                    if (typeof sId !== 'string') {
                        throw new TypeError('$jstore.get() expects a String.');
                    }

                    var pid = _reducePrefix(_prefix + sId);
                    var val = localStorage.getItem(pid);

                    return (val !== null) ? angular.fromJson(val) : null;
                },

                /**
                 * @ngdoc method
                 * @name $jstore#del
                 *
                 * @description
                 * Deletes from the session the pair-value by the keys
                 *
                 * @param {string} sId Id name of the session to use for lookup.
                 * @param {string} key [, keyN] Name of the keys to be deleted from the session.
                 */
                del: function(sId) {
                    if (typeof sId !== 'string') {
                        throw new TypeError('$jstore.del() expects a String.');
                    }

                    var pid = _reducePrefix(_prefix + sId);
                    var obj = this.get(pid);
                    if (obj == null)
                        return;

                    var args = arguments;
                    if (args.length) {
                        for (var i = 1; i < args.length; i++) {
                            delete obj[args[i]];
                        }
                    }

                    localStorage.setItem(pid, angular.toJson(obj));
                },

                /**
                 * @ngdoc method
                 * @name $jstore#omit
                 *
                 * @description
                 * Deletes from session all pairs-value except for the keys
                 *
                 * @param {string} sId Id name of the session to use for lookup.
                 * @param {string} key [, keyN] Name of the keys to be deleted from the session.
                 */
                omit: function(sId) {
                    if (typeof sId !== 'string') {
                        throw new TypeError('$jstore.omit() expects a String.');
                    }

                    var pid = _reducePrefix(_prefix + sId);
                    var obj = this.get(pid);
                    if (obj == null)
                        return;

                    var nObj = {};
                    var args = arguments;
                    if (args.length) {
                        for (var i = 1; i < args.length; i++) {
                            for (var key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    if (key == args[i]) {
                                        nObj[key] = obj[key];
                                    }
                                }
                            }
                        }
                    }

                    localStorage.setItem(pid, angular.toJson(nObj));
                },

                /**
                 * @ngdoc method
                 * @name $jstore#has
                 *
                 * @description
                 * Checks the a session exists in localStorage.
                 *
                 * @param {string} sId Id name of the session to use for lookup.
                 * @returns {Boolean} Returns true if the session exists.
                 */
                has: function(sId) {
                    if (typeof sId !== 'string') {
                        throw new TypeError('$jstore.has() expects a String.');
                    }

                    return this.get(sId) !== null ? true : false;
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
                count: function() {
                    var count = 0;
                    var store = localStorage;
                    var storeSize = store.length;
                    for (var i = 0; i < storeSize; i++) {
                        if (store.key(i).indexOf(_prefix) === 0) {
                            count++;
                        }
                    }

                    return count;
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
                each: function(callback) {
                    if (typeof callback !== 'function')
                        throw new TypeError('$jstore.each() expects a Function with callback.');

                    var store = localStorage;
                    var storeSize = store.length;
                    for (var i = 0; i < storeSize; i++) {
                        var id = localStorage.key(i);
                        if (store.key(i).indexOf(_prefix) === 0) {
                            callback(id, this.get(id));
                        }
                    }
                },

                /**
                 * @ngdoc method
                 * @name $jstore#remove
                 *
                 * @description
                 * Remove the session created in localStorage.
                 *
                 * @param {string} sId Id name of the session to be removed.
                 */
                remove: function(sId) {
                    if (typeof sId !== 'string') {
                        throw new TypeError('$jstore.remove() expects a String.');
                    }

                    var pid = _reducePrefix(_prefix + sId);
                    localStorage.removeItem(pid);
                },

                /**
                 * @ngdoc method
                 * @name $jstore#clear
                 *
                 * @description
                 * Clear all sessions in localStorage.
                 */
                clear: function() {
                    localStorage.clear();
                }
            };
        }];

    });

    return jstore;
}));