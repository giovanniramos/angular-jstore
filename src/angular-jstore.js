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

        // Default values
        var _prefix = 'jstoreApp-';
        var _channel = [];
        var _debug = false;
        var _tabStatus = false;

        // Setter for the prefix
        // e.g. $jstoreProvider.setPrefix('myAppName');
        this.setPrefix = function(value) {
            if (typeof value !== 'string')
                throw new TypeError('$jstoreProvider.setPrefix() expects a String.');

            _prefix = value;
            return this;
        };

        // Setter to enable debugging
        // e.g. $jstoreProvider.setDebug(true);
        this.setDebug = function(value) {
            if (typeof value !== 'boolean')
                throw new TypeError('$jstoreProvider.setDebug() expects a Boolean.');

            _debug = value;
            return this;
        };

        // Setter to apply inactive state on tabs
        // e.g. $jstoreProvider.setTabStatus(true);
        this.setTabStatus = function(value) {
            if (typeof value !== 'boolean')
                throw new TypeError('$jstoreProvider.setTabStatus() expects a Boolean.');

            _tabStatus = value;
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
         *     var SESSION_NAME = "MyYourSessionName";
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
                 * @name $jstore#fire
                 *
                 * @description
                 * Triggers a command listening to the channel.
                 */
                fire: function(obj) {
                    if (typeof obj !== 'object') {
                        throw new TypeError('$jstore.fire() expects a Object has obtained a `' + (typeof obj) + '` as a parameter. Try something like: { command: "reload" }');
                    }

                    if (!obj.command) {
                        return;
                    }

                    if (_debug) {
                        console.log('fired >>', obj.command);
                    }

                    if (_tabStatus) {
                        top.document.title = top.document.title.replace(/\(inactive\)/,'');
                    }

                    localStorage.setItem('cmd', obj.command);
                    localStorage.removeItem('cmd');
                },

                /**
                 * @ngdoc method
                 * @name $jstore#fired
                 *
                 * @description
                 * Fires the corresponding command listening to the channel.
                 */
                fired: function(evt) {
                    angular.forEach(_channel, function(v, k) {
                        if (evt.newValue == _channel[k][0]) {
                            if (_debug) {
                                console.log(' fire >>', _channel[k][0]);
                            }

                            if (_tabStatus) {
                                top.document.title = top.document.title.replace(/\(inactive\)/,'') + ' (inactive)';
                            }

                            _channel[k][1](evt);
                        }
                    });
                },

                /**
                 * @ngdoc method
                 * @name $jstore#watch
                 *
                 * @description
                 * Stores watchers that trigger a command on the channel listener.
                 */
                watch: function(cmd, callback) {
                    if (typeof cmd !== 'string') {
                        throw new TypeError('$jstore.watch() expects a String but got a `' + (typeof cmd) + '` as a first parameter.');
                    }

                    if (typeof callback !== 'function') {
                        throw new TypeError('$jstore.watch() expects a Callback Function with a second argument.');
                    }

                    if (_debug) {
                        console.log('watch >>', cmd);
                    }

                    _channel.push([cmd, callback]);

                    // Verify support for IE < 9
                    if (window.addEventListener) {
                        window.addEventListener('storage', this.fired, false);
                    } else if (window.attachEvent) {
                        window.attachEvent('onstorage', this.fired);
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