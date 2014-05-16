// AngularFire is an officially supported AngularJS binding for Firebase.
// The bindings let you associate a Firebase URL with a model (or set of
// models), and they will be transparently kept in sync across all clients
// currently using your app. The 2-way data binding offered by AngularJS works
// as normal, except that the changes are also sent to all other clients
// instead of just a server.
//
//      AngularFire 0.7.2-pre
//      http://angularfire.com
//      License: MIT

"use strict";

(function() {

    var AngularFire, AngularFireAuth;

    // Define the `firebase` module under which all AngularFire
    // services will live.
    angular.module("firebase", []).value("Firebase", Firebase);

    // Define the `$firebase` service that provides synchronization methods.
    angular.module("firebase").factory("$firebase", ["$q", "$parse", "$timeout",
        function($q, $parse, $timeout) {
            // The factory returns an object containing the value of the data at
            // the Firebase location provided, as well as several methods. It
            // takes a single argument:
            //
            //   * `ref`: A Firebase reference. Queries or limits may be applied.
            return function(ref) {
                var af = new AngularFire($q, $parse, $timeout, ref);
                return af.construct();
            };
        }
    ]);

    // Define the `orderByPriority` filter that sorts objects returned by
    // $firebase in the order of priority. Priority is defined by Firebase,
    // for more info see: https://www.firebase.com/docs/ordered-data.html
    angular.module("firebase").filter("orderByPriority", function() {
        return function(input) {
            var sorted = [];
            if (input) {
                if (!input.$getIndex || typeof input.$getIndex != "function") {
                    // input is not an angularFire instance
                    if (angular.isArray(input)) {
                        // If input is an array, copy it
                        sorted = input.slice(0);
                    } else if (angular.isObject(input)) {
                        // If input is an object, map it to an array
                        angular.forEach(input, function(prop) {
                            sorted.push(prop);
                        });
                    }
                } else {
                    // input is an angularFire instance
                    var index = input.$getIndex();
                    if (index.length > 0) {
                        for (var i = 0; i < index.length; i++) {
                            var val = input[index[i]];
                            if (val) {
                                val.$id = index[i];
                                sorted.push(val);
                            }
                        }
                    }
                }
            }
            return sorted;
        };
    });

    // Shim Array.indexOf for IE compatibility.
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            if (this === undefined || this === null) {
                throw new TypeError("'this' is null or not defined");
            }
            // Hack to convert object.length to a UInt32
            // jshint -W016
            var length = this.length >>> 0;
            fromIndex = +fromIndex || 0;
            // jshint +W016

            if (Math.abs(fromIndex) === Infinity) {
                fromIndex = 0;
            }

            if (fromIndex < 0) {
                fromIndex += length;
                if (fromIndex < 0) {
                    fromIndex = 0;
                }
            }

            for (;fromIndex < length; fromIndex++) {
                if (this[fromIndex] === searchElement) {
                    return fromIndex;
                }
            }

            return -1;
        };
    }

    // The `AngularFire` object that implements synchronization.
    AngularFire = function($q, $parse, $timeout, ref) {
        this._q = $q;
        this._parse = $parse;
        this._timeout = $timeout;

        // set to true when $bind is called, this tells us whether we need
        // to synchronize a $scope variable during data change events
        // and also whether we will need to $watch the variable for changes
        // we can only $bind to a single instance at a time
        this._bound = false;

        // true after the initial loading event completes, see _getInitialValue()
        this._loaded = false;

        // stores the list of keys if our data is an object, see $getIndex()
        this._index = [];

        // An object storing handlers used for different events.
        this._on = {
            value: [],
            change: [],
            loaded: [],
            child_added: [],
            child_moved: [],
            child_changed: [],
            child_removed: []
        };

        if (typeof ref == "string") {
            throw new Error("Please provide a Firebase reference instead " +
                "of a URL, eg: new Firebase(url)");
        }
        this._fRef = ref;
    };

    AngularFire.prototype = {
        // This function is called by the factory to create a new explicit sync
        // point between a particular model and a Firebase location.
        construct: function() {
            var self = this;
            var object = {};

            // Set the $id val equal to the Firebase reference's name() function.
            object.$id = self._fRef.ref().name();

            // Establish a 3-way data binding (implicit sync) with the specified
            // Firebase location and a model on $scope. To be used from a controller
            // to automatically synchronize *all* local changes. It takes three
            // arguments:
            //
            //    * `$scope`   : The scope with which the bound model is associated.
            //    * `name`     : The name of the model.
            //    * `defaultFn`: A function that provides a default value if the
            //                   remote value is not set. Optional.
            //
            // This function also returns a promise, which, when resolved, will be
            // provided an `unbind` method, a function which you can call to stop
            // watching the local model for changes.
            object.$bind = function(scope, name, defaultFn) {
                return self._bind(scope, name, defaultFn);
            };

            // Add an object to the remote data. Adding an object is the
            // equivalent of calling `push()` on a Firebase reference. It takes
            // one argument:
            //
            //    * `item`: The object or primitive to add.
            //
            // This function returns a promise that will be resolved when the data
            // has been successfully written to the server. If the promise is
            // resolved, it will be provided with a reference to the newly added
            // object or primitive. The key name can be extracted using `ref.name()`.
            // If the promise fails, it will resolve to an error.
            object.$add = function(item) {
                var ref;
                var deferred = self._q.defer();

                function _addCb(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(ref);
                    }
                }

                if (typeof item == "object") {
                    ref = self._fRef.ref().push(self._parseObject(item), _addCb);
                } else {
                    ref = self._fRef.ref().push(item, _addCb);
                }

                return deferred.promise;
            };

            // Save the current state of the object (or a child) to the remote.
            // Takes a single optional argument:
            //
            //    * `key`: Specify a child key to save the data for. If no key is
            //             specified, the entire object's current state will
            //             be saved.
            //
            // This function returns a promise that will be resolved when the
            // data has been successfully saved to the server.
            object.$save = function(key) {
                var deferred = self._q.defer();

                function _saveCb(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                }

                if (key) {
                    var obj = self._parseObject(self._object[key]);
                    self._fRef.ref().child(key).set(obj, _saveCb);
                } else {
                    self._fRef.ref().set(self._parseObject(self._object), _saveCb);
                }

                return deferred.promise;
            };

            // Set the current state of the object to the specified value. Calling
            // this is the equivalent of calling `set()` on a Firebase reference.
            // Takes a single mandatory argument:
            //
            //    * `newValue`: The value which should overwrite data stored at
            //                  this location.
            //
            // This function returns a promise that will be resolved when the
            // data has been successfully saved to the server.
            object.$set = function(newValue) {
                var deferred = self._q.defer();
                self._fRef.ref().set(self._parseObject(newValue), function(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                });
                return deferred.promise;
            };

            // Non-destructively update only a subset of keys for the current object.
            // This is the equivalent of calling `update()` on a Firebase reference.
            // Takes a single mandatory argument:
            //
            //    * `newValue`: The set of keys and values that must be updated for
            //                  this location.
            //
            // This function returns a promise that will be resolved when the data
            // has been successfully saved to the server.
            object.$update = function(newValue) {
                var deferred = self._q.defer();
                self._fRef.ref().update(self._parseObject(newValue), function(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                });
                return deferred.promise;
            };

            // Update a value within a transaction. Calling this is the
            // equivalent of calling `transaction()` on a Firebase reference.
            //
            //  * `updateFn`:     A developer-supplied function which will be passed
            //                    the current data stored at this location (as a
            //                    Javascript object). The function should return the
            //                    new value it would like written (as a Javascript
            //                    object). If "undefined" is returned (i.e. you
            //                    "return;" with no arguments) the transaction will
            //                    be aborted and the data at this location will not
            //                    be modified.
            //  * `applyLocally`: By default, events are raised each time the
            //                    transaction update function runs. So if it is run
            //                    multiple times, you may see intermediate states.
            //                    You can set this to false to suppress these
            //                    intermediate states and instead wait until the
            //                    transaction has completed before events are raised.
            //
            //  This function returns a promise that will be resolved when the
            //  transaction function has completed. A successful transaction is
            //  resolved with the snapshot. If the transaction is aborted,
            //  the promise will be resolved with null.
            object.$transaction = function(updateFn, applyLocally) {
                var deferred = self._q.defer();
                self._fRef.ref().transaction(updateFn,
                    function(err, committed, snapshot) {
                        if (err) {
                            deferred.reject(err);
                        } else if (!committed) {
                            deferred.resolve(null);
                        } else {
                            deferred.resolve(snapshot);
                        }
                    },
                    applyLocally);

                return deferred.promise;
            };

            // Remove this object from the remote data. Calling this is the
            // equivalent of calling `remove()` on a Firebase reference. This
            // function takes a single optional argument:
            //
            //    * `key`: Specify a child key to remove. If no key is specified, the
            //             entire object will be removed from the remote data store.
            //
            // This function returns a promise that will be resolved when the
            // object has been successfully removed from the server.
            object.$remove = function(key) {
                var deferred = self._q.defer();

                function _removeCb(err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                }

                if (key) {
                    self._fRef.ref().child(key).remove(_removeCb);
                } else {
                    self._fRef.ref().remove(_removeCb);
                }

                return deferred.promise;
            };

            // Get an AngularFire wrapper for a named child. This function takes
            // one mandatory argument:
            //
            //    * `key`: The key name that will point to the child reference to be
            //             returned.
            object.$child = function(key) {
                var af = new AngularFire(
                    self._q, self._parse, self._timeout, self._fRef.ref().child(key)
                );
                return af.construct();
            };

            // Attach an event handler for when the object is changed. You can attach
            // handlers for all Firebase events like "child_added", "value", and
            // "child_removed". Additionally, the following events, specific to
            // AngularFire, can be listened to.
            //
            //  - "change": The provided function will be called whenever the local
            //              object is modified because the remote data was updated.
            //  - "loaded": This function will be called *once*, when the initial
            //              data has been loaded. 'object' will be an empty
            //              object ({}) until this function is called.
            object.$on = function(type, callback) {
                if( self._on.hasOwnProperty(type) ) {
                    self._sendInitEvent(type, callback);
                    // One exception if made for the 'loaded' event. If we already loaded
                    // data (perhaps because it was synced), simply fire the callback.
                    if (type !== "loaded" || !this._loaded) {
                        self._on[type].push(callback);
                    }
                } else {
                    throw new Error("Invalid event type " + type + " specified");
                }
                return object;
            };

            // Detach an event handler from a specified event type. If no callback
            // is specified, all event handlers for the specified event type will
            // be detached.
            //
            // If no type if provided, synchronization for this instance of $firebase
            // will be turned off complete.
            object.$off = function(type, callback) {
                if (self._on.hasOwnProperty(type)) {
                    if (callback) {
                        var index = self._on[type].indexOf(callback);
                        if (index !== -1) {
                            self._on[type].splice(index, 1);
                        }
                    } else {
                        self._on[type] = [];
                    }
                } else {
                    self._fRef.off();
                }
            };

            // Authenticate this Firebase reference with a custom auth token.
            // Refer to the Firebase documentation on "Custom Login" for details.
            // Returns a promise that will be resolved when authentication is
            // successfully completed.
            object.$auth = function(token) {
                var deferred = self._q.defer();
                self._fRef.auth(token, function(err, obj) {
                    if (err !== null) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(obj);
                    }
                }, function(rej) {
                    deferred.reject(rej);
                });
                return deferred.promise;
            };

            // Return the current index, which is a list of key names in an array,
            // ordered by their Firebase priority.
            object.$getIndex = function() {
                return angular.copy(self._index);
            };

            // Return the reference used by this object.
            object.$getRef = function() {
                return self._fRef.ref();
            };

            // Act like a then-able
            object.then = function(success) {
                var deferred = self._q.defer();
                var onLoad = function() {
                    object.then = null;
                    object.$off("loaded", onLoad);
                    deferred.resolve(object);
                };
                object.$on("loaded", onLoad);
                return deferred.promise.then(success);
            };

            self._object = object;
            self._getInitialValue();

            return self._object;
        },

        // This function is responsible for fetching the initial data for the
        // given reference and attaching appropriate child event handlers.
        _getInitialValue: function() {
            var self = this;

            // store changes to children and update the index of keys appropriately
            function _processSnapshot(snapshot, prevChild) {
                var key = snapshot.name();
                var val = snapshot.val();

                // If the item already exists in the index, remove it first.
                var curIdx = self._index.indexOf(key);
                if (curIdx !== -1) {
                    self._index.splice(curIdx, 1);
                }

                // Update index. This is used by $getIndex and orderByPriority.
                if (prevChild) {
                    var prevIdx = self._index.indexOf(prevChild);
                    self._index.splice(prevIdx + 1, 0, key);
                } else {
                    self._index.unshift(key);
                }

                // Store the priority of the current property as "$priority". Changing
                // the value of this property will also update the priority of the
                // object (see _parseObject).
                if (!_isPrimitive(val) && snapshot.getPriority() !== null) {
                    val.$priority = snapshot.getPriority();
                }
                self._updateModel(key, val);
            }

            // Helper function to attach and broadcast events.
            function _handleAndBroadcastEvent(type, handler) {
                return function(snapshot, prevChild) {
                    handler(snapshot, prevChild);
                    self._broadcastEvent(type, self._makeEventSnapshot(snapshot.name(), snapshot.val(), prevChild));
                };
            }

            function _handleFirebaseEvent(type, handler) {
                self._fRef.on(type, _handleAndBroadcastEvent(type, handler));
            }
            _handleFirebaseEvent("child_added", _processSnapshot);
            _handleFirebaseEvent("child_moved", _processSnapshot);
            _handleFirebaseEvent("child_changed", _processSnapshot);
            _handleFirebaseEvent("child_removed", function(snapshot) {
                // Remove from index.
                var key = snapshot.name();
                var idx = self._index.indexOf(key);
                self._index.splice(idx, 1);

                // Remove from local model.
                self._updateModel(key, null);
            });

            function _isPrimitive(v) {
                return v === null || typeof(v) !== 'object';
            }

            function _initialLoad(value) {
                // Call handlers for the "loaded" event.
                self._loaded = true;
                self._broadcastEvent("loaded", value);
            }

            function handleNullValues(value) {
                // NULLs are handled specially. If there's a 3-way data binding
                // on a local primitive, then update that, otherwise switch to object
                // binding using child events.
                if (self._bound && value === null) {
                    var local = self._parseObject(self._parse(self._name)(self._scope));
                    switch (typeof local) {
                        // Primitive defaults.
                        case "string":
                        case "undefined":
                            value = "";
                            break;
                        case "number":
                            value = 0;
                            break;
                        case "boolean":
                            value = false;
                            break;
                    }
                }

                return value;
            }

            // We handle primitives and objects here together. There is no harm in having
            // child_* listeners attached; if the data suddenly changes between an object
            // and a primitive, the child_added/removed events will fire, and our data here
            // will get updated accordingly so we should be able to transition without issue
            self._fRef.on('value', function(snap) {
                // primitive handling
                var value = snap.val();
                if( _isPrimitive(value) ) {
                    value = handleNullValues(value);
                    self._updatePrimitive(value);
                }
                else {
                    delete self._object.$value;
                }

                // broadcast the value event
                self._broadcastEvent('value', self._makeEventSnapshot(snap.name(), value));

                // broadcast initial loaded event once data and indices are set up appropriately
                if( !self._loaded ) {
                    _initialLoad(value);
                }
            });
        },

        // Called whenever there is a remote change. Applies them to the local
        // model for both explicit and implicit sync modes.
        _updateModel: function(key, value) {
            if (value == null) {
                delete this._object[key];
            } else {
                this._object[key] = value;
            }

            // Call change handlers.
            this._broadcastEvent("change", key);

            // update Angular by forcing a compile event
            this._triggerModelUpdate();
        },

        // this method triggers a self._timeout event, which forces Angular to run $apply()
        // and compile the DOM content
        _triggerModelUpdate: function() {
            // since the timeout runs asynchronously, multiple updates could invoke this method
            // before it is actually executed (this occurs when Firebase sends it's initial deluge of data
            // back to our _getInitialValue() method, or when there are locally cached changes)
            // We don't want to trigger it multiple times if we can help, creating multiple dirty checks
            // and $apply operations, which are costly, so if one is already queued, we just wait for
            // it to do its work.
            if( !this._runningTimer ) {
                var self = this;
                this._runningTimer = self._timeout(function() {
                    self._runningTimer = null;

                    // If there is an implicit binding, also update the local model.
                    if (!self._bound) {
                        return;
                    }

                    var current = self._object;
                    var local = self._parse(self._name)(self._scope);
                    // If remote value matches local value, don't do anything, otherwise
                    // apply the change.
                    if (!angular.equals(current, local)) {
                        self._parse(self._name).assign(self._scope, angular.copy(current));
                    }
                });
            }
        },

        // Called whenever there is a remote change for a primitive value.
        _updatePrimitive: function(value) {
            var self = this;
            self._timeout(function() {
                // Primitive values are represented as a special object
                // {$value: value}. Only update if the remote value is different from
                // the local value.
                if (!self._object.$value ||
                    !angular.equals(self._object.$value, value)) {
                    self._object.$value = value;
                }

                // Call change handlers.
                self._broadcastEvent("change");

                // If there's an implicit binding, simply update the local scope model.
                if (self._bound) {
                    var local = self._parseObject(self._parse(self._name)(self._scope));
                    if (!angular.equals(local, value)) {
                        self._parse(self._name).assign(self._scope, value);
                    }
                }
            });
        },

        // If event handlers for a specified event were attached, call them.
        _broadcastEvent: function(evt, param) {
            var cbs = this._on[evt] || [];
            if( evt === 'loaded' ) {
                this._on[evt] = []; // release memory
            }
            var self = this;

            function _wrapTimeout(cb, param) {
                self._timeout(function() {
                    cb(param);
                });
            }

            if (cbs.length > 0) {
                for (var i = 0; i < cbs.length; i++) {
                    if (typeof cbs[i] == "function") {
                        _wrapTimeout(cbs[i], param);
                    }
                }
            }
        },

        // triggers an initial event for loaded, value, and child_added events (which get immediate feedback)
        _sendInitEvent: function(evt, callback) {
            var self = this;
            if( self._loaded && ['child_added', 'loaded', 'value'].indexOf(evt) > -1 ) {
                self._timeout(function() {
                    var parsedValue = self._object.hasOwnProperty('$value')?
                        self._object.$value : self._parseObject(self._object);
                    switch(evt) {
                        case 'loaded':
                            callback(parsedValue);
                            break;
                        case 'value':
                            callback(self._makeEventSnapshot(self._fRef.name(), parsedValue, null));
                            break;
                        case 'child_added':
                            self._iterateChildren(parsedValue, function(name, val, prev) {
                                callback(self._makeEventSnapshot(name, val, prev));
                            });
                            break;
                        default: // not reachable
                    }
                });
            }
        },

        // assuming data is an object, this method will iterate all
        // child keys and invoke callback with (key, value, prevChild)
        _iterateChildren: function(data, callback) {
            if( this._loaded && angular.isObject(data) ) {
                var prev = null;
                for(var key in data) {
                    if( data.hasOwnProperty(key) ) {
                        callback(key, data[key], prev);
                        prev = key;
                    }
                }
            }
        },

        // creates a snapshot object compatible with _broadcastEvent notifications
        _makeEventSnapshot: function(key, value, prevChild) {
            if( angular.isUndefined(prevChild) ) {
                prevChild = null;
            }
            return {
                snapshot: {
                    name: key,
                    value: value
                },
                prevChild: prevChild
            };
        },

        // This function creates a 3-way binding between the provided scope model
        // and Firebase. All changes made to the local model are saved to Firebase
        // and changes to the remote data automatically appear on the local model.
        _bind: function(scope, name, defaultFn) {
            var self = this;
            var deferred = self._q.defer();

            // _updateModel or _updatePrimitive will take care of updating the local
            // model if _bound is set to true.
            self._name = name;
            self._bound = true;
            self._scope = scope;

            // If the local model is an object, call an update to set local values.
            var local = self._parse(name)(scope);
            if (local !== undefined && typeof local == "object") {
                self._fRef.ref().update(self._parseObject(local));
            }

            // When the scope is destroyed, unbind automatically.
            scope.$on("$destroy", function() {
                unbind();
            });

            // Once we receive the initial value, the promise will be resolved.
            self._object.$on('loaded', function(value) {
                self._timeout(function() {
                    if(value === null && typeof defaultFn === 'function') {
                        scope[name] = defaultFn();
                    }
                    else {
                        scope[name] = value;
                    }
                    deferred.resolve(unbind);
                });
            });

            // We're responsible for setting up scope.$watch to reflect local changes
            // on the Firebase data.
            var unbind = scope.$watch(name, function() {
                // If the new local value matches the current remote value, we don't
                // trigger a remote update.
                var local = self._parseObject(self._parse(name)(scope));
                if (self._object.$value !== undefined &&
                    angular.equals(local, self._object.$value)) {
                    return;
                } else if (angular.equals(local, self._parseObject(self._object))) {
                    return;
                }

                // If the local model is undefined or the remote data hasn't been
                // loaded yet, don't update.
                if (local === undefined || !self._loaded) {
                    return;
                }

                // Use update if limits are in effect, set if not.
                if (self._fRef.set) {
                    self._fRef.set(local);
                } else {
                    self._fRef.ref().update(local);
                }
            }, true);

            return deferred.promise;
        },

        // Parse a local model, removing all properties beginning with "$" and
        // converting $priority to ".priority".
        _parseObject: function(obj) {
            function _findReplacePriority(item) {
                for (var prop in item) {
                    if (item.hasOwnProperty(prop)) {
                        if (prop == "$priority") {
                            item[".priority"] = item.$priority;
                            delete item.$priority;
                        } else if (typeof item[prop] == "object") {
                            _findReplacePriority(item[prop]);
                        }
                    }
                }
                return item;
            }

            // We use toJson/fromJson to remove $$hashKey and others. Can be replaced
            // by angular.copy, but only for later versions of AngularJS.
            var newObj = _findReplacePriority(angular.copy(obj));
            return angular.fromJson(angular.toJson(newObj));
        }
    };


    // Defines the `$firebaseSimpleLogin` service that provides simple
    // user authentication support for AngularFire.
    angular.module("firebase").factory("$firebaseSimpleLogin", [
        "$q", "$timeout", "$rootScope", function($q, $t, $rs) {
            // The factory returns an object containing the authentication state
            // of the current user. This service takes one argument:
            //
            //   * `ref`     : A Firebase reference.
            //
            // The returned object has the following properties:
            //
            //  * `user`: Set to "null" if the user is currently logged out. This
            //    value will be changed to an object when the user successfully logs
            //    in. This object will contain details of the logged in user. The
            //    exact properties will vary based on the method used to login, but
            //    will at a minimum contain the `id` and `provider` properties.
            //
            // The returned object will also have the following methods available:
            // $login(), $logout(), $createUser(), $changePassword(), $removeUser(),
            // and $getCurrentUser().
            return function(ref) {
                var auth = new AngularFireAuth($q, $t, $rs, ref);
                return auth.construct();
            };
        }
    ]);

    AngularFireAuth = function($q, $t, $rs, ref) {
        this._q = $q;
        this._timeout = $t;
        this._rootScope = $rs;
        this._loginDeferred = null;
        this._getCurrentUserDeferred = [];
        this._currentUserData = undefined;

        if (typeof ref == "string") {
            throw new Error("Please provide a Firebase reference instead " +
                "of a URL, eg: new Firebase(url)");
        }
        this._fRef = ref;
    };

    AngularFireAuth.prototype = {
        construct: function() {
            var object = {
                user: null,
                $login: this.login.bind(this),
                $logout: this.logout.bind(this),
                $createUser: this.createUser.bind(this),
                $changePassword: this.changePassword.bind(this),
                $removeUser: this.removeUser.bind(this),
                $getCurrentUser: this.getCurrentUser.bind(this),
                $sendPasswordResetEmail: this.sendPasswordResetEmail.bind(this)
            };
            this._object = object;

            // Initialize Simple Login.
            if (!window.FirebaseSimpleLogin) {
                var err = new Error("FirebaseSimpleLogin is undefined. " +
                    "Did you forget to include firebase-simple-login.js?");
                this._rootScope.$broadcast("$firebaseSimpleLogin:error", err);
                throw err;
            }

            var client = new FirebaseSimpleLogin(this._fRef,
                this._onLoginEvent.bind(this));
            this._authClient = client;
            return this._object;
        },

        // The login method takes a provider (for Simple Login) and authenticates
        // the Firebase reference with which the service was initialized. This
        // method returns a promise, which will be resolved when the login succeeds
        // (and rejected when an error occurs).
        login: function(provider, options) {
            var deferred = this._q.defer();
            var self = this;

            // To avoid the promise from being fulfilled by our initial login state,
            // make sure we have it before triggering the login and creating a new
            // promise.
            this.getCurrentUser().then(function() {
                self._loginDeferred = deferred;
                self._authClient.login(provider, options);
            });

            return deferred.promise;
        },

        // Unauthenticate the Firebase reference.
        logout: function() {
            // Tell the simple login client to log us out.
            this._authClient.logout();

            // Forget who we were, so that any getCurrentUser calls will wait for
            // another user event.
            delete this._currentUserData;
        },

        // Creates a user for Firebase Simple Login. Function 'cb' receives an
        // error as the first argument and a Simple Login user object as the second
        // argument. Note that this function only creates the user, if you wish to
        // log in as the newly created user, call $login() after the promise for
        // this method has been fulfilled.
        createUser: function(email, password) {
            var self = this;
            var deferred = this._q.defer();

            self._authClient.createUser(email, password, function(err, user) {
                if (err) {
                    self._rootScope.$broadcast("$firebaseSimpleLogin:error", err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(user);
                }
            });

            return deferred.promise;
        },

        // Changes the password for a Firebase Simple Login user. Take an email,
        // old password and new password as three mandatory arguments. Returns a
        // promise.
        changePassword: function(email, oldPassword, newPassword) {
            var self = this;
            var deferred = this._q.defer();

            self._authClient.changePassword(email, oldPassword, newPassword,
                function(err) {
                    if (err) {
                        self._rootScope.$broadcast("$firebaseSimpleLogin:error", err);
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                }
            );

            return deferred.promise;
        },

        // Gets a promise for the current user info.
        getCurrentUser: function() {
            var self = this;
            var deferred = this._q.defer();

            if (self._currentUserData !== undefined) {
                deferred.resolve(self._currentUserData);
            } else {
                self._getCurrentUserDeferred.push(deferred);
            }

            return deferred.promise;
        },

        // Remove a user for the listed email address. Returns a promise.
        removeUser: function(email, password) {
            var self = this;
            var deferred = this._q.defer();

            self._authClient.removeUser(email, password, function(err) {
                if (err) {
                    self._rootScope.$broadcast("$firebaseSimpleLogin:error", err);
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });

            return deferred.promise;
        },

        // Send a password reset email to the user for an email + password account.
        sendPasswordResetEmail: function(email) {
            var self = this;
            var deferred = this._q.defer();

            self._authClient.sendPasswordResetEmail(email, function(err) {
                if (err) {
                    self._rootScope.$broadcast("$firebaseSimpleLogin:error", err);
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });

            return deferred.promise;
        },

        // Internal callback for any Simple Login event.
        _onLoginEvent: function(err, user) {
            // HACK -- calls to logout() trigger events even if we're not logged in,
            // making us get extra events. Throw them away. This should be fixed by
            // changing Simple Login so that its callbacks refer directly to the
            // action that caused them.
            if (this._currentUserData === user && err === null) {
                return;
            }

            var self = this;
            if (err) {
                if (self._loginDeferred) {
                    self._loginDeferred.reject(err);
                    self._loginDeferred = null;
                }
                self._rootScope.$broadcast("$firebaseSimpleLogin:error", err);
            } else {
                this._currentUserData = user;

                self._timeout(function() {
                    self._object.user = user;
                    if (user) {
                        self._rootScope.$broadcast("$firebaseSimpleLogin:login", user);
                    } else {
                        self._rootScope.$broadcast("$firebaseSimpleLogin:logout");
                    }
                    if (self._loginDeferred) {
                        self._loginDeferred.resolve(user);
                        self._loginDeferred = null;
                    }
                    while (self._getCurrentUserDeferred.length > 0) {
                        var def = self._getCurrentUserDeferred.pop();
                        def.resolve(user);
                    }
                });
            }
        }
    };
})();

(function() {
    angular.module('theSandboxChallenge.config', []);
}());



(function() {

    var app = angular.module('theSandboxChallenge', ['theSandboxChallenge.config', 'firebase', 'ui.bootstrap']);

    app.config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            // Allow loading from github pages
            'http://robianmcd.github.io/the-sandbox-challenge/**']);
    });

}());


(function() {
    var app = angular.module('theSandboxChallenge');

    //language=HTML
    var loginButtonsHtml = '\
        <span ng-click="ctrl.login(\'github\')" class="fa fa-github btn btn-default btn-fa navbar-btn"></span>\
        <span ng-click="ctrl.login(\'google\')" class="fa fa-google-plus btn btn-default btn-fa navbar-btn"></span>\
        <span ng-click="ctrl.login(\'facebook\')" class="fa fa-facebook-square btn btn-default btn-fa navbar-btn"></span>';

    app.directive('loginButtons', function() {
        return {
            template: loginButtonsHtml
        }
    });
})();
(function() {

    var app = angular.module('theSandboxChallenge');

    //language=HTML
    var sandboxChallengeHtml = '\
        <div style="margin-top:30px">\
            <div class="navbar navbar-default">\
                <div class="container-fluid">\
                    <div class="navbar-header">\
                        <span class="navbar-brand">Challenges:</span>\
                    </div>\
                    <ul class="nav navbar-nav">\
                        <li ng-repeat="(group, challenge) in ctrl.challengeConfig.challenges" ng-class="{active: group === ctrl.group}">\
                            <a ng-click="ctrl.goToGroup(group)" href="">{{group}}</a>\
                        </li>\
                    </ul>\
                    <span ng-if="ctrl.loginStateDetermined && !ctrl.auth.user">\
                        <span class="navbar-right">\
                            Login with:\
                            <span login-buttons></span>\
                        </span>\
                    </span>\
                    <span ng-if="ctrl.loginStateDetermined && ctrl.auth.user">\
                        <span style="margin-top:5px" class="navbar-right">\
                            <a ng-click="ctrl.logout()" class="navbar-link" href="">Log out</a>\
                            <img class="navbar-img" height="40px" ng-src="{{ctrl.getPicFromUser(ctrl.auth.user)}}" alt="Profile"/>\
                        </span>\
                    </span>\
                </div>\
            </div>\
            <div style="margin: 20px 5px">\
                <div style="width: 100%" class="btn-group btn-group-lg" dropdown>\
                    <button style="width: 100%" type="button" class="btn btn-default dropdown-toggle">\
                        <span ng-show="ctrl.challenges[ctrl.challengeId].completed" class="text-success glyphicon glyphicon-ok"></span> \
                        {{ctrl.challenges[ctrl.challengeId].name}} <span class="caret"></span>\
                    </button>\
                    <ul class="dropdown-menu" role="menu">\
                        <li ng-repeat="challengeId in ctrl.challengeOrder">\
                            <a href="" ng-click="ctrl.goToChallenge(challengeId)">\
                                <span ng-show="ctrl.challenges[challengeId].completed" class="text-success glyphicon glyphicon-ok"></span> \
                                <strong ng-show="challengeId === ctrl.challengeId">{{ctrl.challenges[challengeId].name}}</strong>\
                                <span ng-show="challengeId !== ctrl.challengeId">{{ctrl.challenges[challengeId].name}}</span>\
                            </a>\
                        </li>\
                    </ul>\
                </div>\
            </div>\
            \
            <p ng-bind-html="ctrl.description"></p>\
            \
            <h4>Test Cases</h4>\
            <table class="table">\
                <tr>\
                    <th></th>\
                    <th>Description</th>\
                    <th>Expression</th>\
                    <th>Expected Value</th>\
                    <th>Actual Value</th>\
                </tr>\
                <tr ng-repeat="testCase in ctrl.testCases">\
                    <td>\
                        <span ng-show="testCase.isPassing()" class="text-success glyphicon glyphicon-ok"></span>\
                        <span ng-show="!testCase.isPassing()" class="text-danger glyphicon glyphicon-remove"></span>\
                    </td>\
                    <td ng-bind-html="testCase.description"></td>\
                    <td ng-bind-html="testCase.expression"></td>\
                    <td>\
                        {{testCase.expectedValue || \'undefined\'}}\
                    </td>\
                    <td ng-class="{danger: !testCase.isPassing(), \'text-danger\': !testCase.isPassing()}">\
                        {{ctrl.safelyGetTestCaseValue(testCase) || \'undefined\'}}\
                    </td>\
                </tr>\
            </table>\
            \
            <div ng-show="ctrl.allPassing">\
                Nice Job!\
                <div ng-show="ctrl.loginStateDetermined && !ctrl.auth.user">\
                    Share you accomplishments on the leader board by logging in:\
                    <span login-buttons></span>\
                </div>\
                <div ng-show="ctrl.getNextChallengeId()" style="text-align:center; margin-top:20px">\
                    <button ng-click="ctrl.goToChallenge(ctrl.getNextChallengeId())" class="btn btn-success btn-lg">\
                        Next Challenge <span class="fa fa-arrow-right"></span>\
                    </button>\
                </div>\
            </div>\
            <div>\
                <h3>Leaderboard</h3>\
                <div class="row">\
                    <div class="col-sm-6">\
                        <div class="panel panel-success">\
                            <div class="panel-heading">High scores</div>\
                            <div class="panel-body">\
                                <div class="row" ng-repeat="userData in ctrl.leaderboard | orderByPriority | orderBy:ctrl.getScoreFromUserData.bind(ctrl) | reverse | limitTo:10">\
                                    <div class="col-xs-1">\
                                        <h3>{{$index + 1}}</h3>\
                                    </div>\
                                    <!--Bootstrap has issues with col-xs-1 columns so we need to make this one 10 instead of 11: http://stackoverflow.com/questions/18365908/bootstrap-3-column-wraps-in-portrait-view-only-->\
                                    <div class="col-xs-10">\
                                        <!--The margins on top of a media entry are only applied if they are not a first child. This makes sure that only the first media entry is a first child-->\
                                        <div ng-if="$index !== 0"></div>\
                                        <div class="media">\
                                            <a class="pull-left" href="">\
                                                <img class="media-object" ng-src="{{userData.profile.pic}}" width="60px" alt="Profile Picture">\
                                            </a>\
                                            <div class="media-body">\
                                                <h4 class="media-heading">{{userData.profile.name}}</h4>\
                                                Score: <strong>{{ctrl.getScoreFromUserData(userData) || 0}}</strong>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="col-sm-6">\
                        <div class="panel panel-info">\
                            <div class="panel-heading">Recent Activity</div>\
                            <div class="panel-body">\
                                <div class="media" ng-repeat="userData in ctrl.leaderboard | orderByPriority | reverse | limitTo:10" \
                                    ng-init="lastChallenge = ctrl.getLastCompletedChallengeFromUserData(userData)" ng-show="lastChallenge">\
                                    <a class="pull-left" href="">\
                                        <img class="media-object" ng-src="{{userData.profile.pic}}" width="60px" alt="Profile Picture">\
                                    </a>\
                                    <div class="media-body">\
                                        <h4 class="media-heading">{{userData.profile.name}}</h4>\
                                        Completed "<strong>{{lastChallenge.name}}</strong>", \
                                        {{ctrl.timeSince(lastChallenge.date)}} ago.\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </div>\
        ';

    app.directive('sandboxChallenge', function() {
        return {
            scope: {
                group: '=',
                challengeId: '=',
                testCases: '=',
                description: '='

            },
            controller: SandboxChallengeCtrl,
            controllerAs: 'ctrl',
            template: sandboxChallengeHtml
        }
    });

    var SandboxChallengeCtrl = function($scope, $rootScope, $firebase, $firebaseSimpleLogin, $sce, challengeConfig) {
        var _this = this;
        this.group = $scope.group;
        this.challengeId = $scope.challengeId;
        this.testCases = $scope.testCases;
        this.description = $sce.trustAsHtml($scope.description);
        this.challengeConfig = challengeConfig;

        this.challenges = challengeConfig.challenges[this.group];
        this.challengeOrder = challengeConfig.order[this.group];

        //setup firebase connection
        this.dbRef = new Firebase('https://sandbox-challenge.firebaseio.com');
        this.leaderboard = $firebase(this.dbRef.child('leaderboard'));
        this.auth = $firebaseSimpleLogin(this.dbRef);
        $rootScope.$on("$firebaseSimpleLogin:login", this.onUserLoggedIn.bind(this));

        this.allPassing = true;
        for (var i = 0; i < this.testCases.length; i++) {
            this.allPassing = this.allPassing && this.testCases[i].isPassing();
        }

        if (this.allPassing) {
            this.challenges[this.challengeId].completed = true;
        }

        this.loginStateDetermined = false;
        this.auth.$getCurrentUser().then(function() {
            _this.loginStateDetermined = true;
        });

    };

    SandboxChallengeCtrl.prototype.safelyGetTestCaseValue = function(testCase) {
        try {
            return testCase.getActualValue();
        } catch (err) {
            return err;
        }

    };

    SandboxChallengeCtrl.prototype.login = function(provider) {
        this.auth.$login(provider);
    };

    SandboxChallengeCtrl.prototype.logout = function() {
        this.auth.$logout();
    };

    SandboxChallengeCtrl.prototype.onUserLoggedIn = function(event, user) {
        var _this = this;
        this.leaderboard[user.uid] = this.leaderboard[user.uid] || {};

        //Wait for the data to load from firebase incase it hasn't already been loaded
        var onDataLoaded = function() {
            _this.leaderboard[user.uid].profile = {
                name: user.displayName,
                pic: _this.getPicFromUser(user)
            };

            _this.leaderboard[user.uid].challenges = _this.leaderboard[user.uid].challenges || {};
            var userChallenges = _this.leaderboard[user.uid].challenges;

            if (_this.allPassing && !userChallenges[_this.challengeId]) {
                var now = new Date();
                userChallenges[_this.challengeId] = now;
                _this.leaderboard[user.uid].$priority = now;
            }

            _this.leaderboard.$save(user.uid);

            for (var key in userChallenges) {
                if (key in _this.challenges) {
                    _this.challenges[key].completed = true;
                }
            }
        };

        if (this.leaderboard.then) {
            this.leaderboard.then(onDataLoaded);
        } else {
            onDataLoaded();
        }
    };

    SandboxChallengeCtrl.prototype.getPicFromUser = function(user) {
        switch (user.provider) {
            case 'github':
                return user.thirdPartyUserData.avatar_url;
            case 'google':
                return user.thirdPartyUserData.picture;
            case 'facebook':
                return 'https://graph.facebook.com/' + user.id + '/picture';
        }

    };

    SandboxChallengeCtrl.prototype.getScoreFromUserData = function(userData) {
        var score = 0;

        for (var challengeId in userData.challenges) {
            if (this.challenges.hasOwnProperty(challengeId)) {
                score++;
            }
        }

        return score;
    };

    SandboxChallengeCtrl.prototype.getLastCompletedChallengeFromUserData = function(userData) {
        var latestCompletedChallengeDate = null;
        var latestCompletedChallenge = null;

        for (var challengeId in userData.challenges) {
            if (this.challenges.hasOwnProperty(challengeId)) {

                if (!latestCompletedChallengeDate || userData.challenges[challengeId] > latestCompletedChallengeDate) {
                    latestCompletedChallengeDate = userData.challenges[challengeId];
                    latestCompletedChallenge = this.challenges[challengeId];
                }
            }
        }

        //This shouldn't really come up but could if someone logs in before they complete a challenge.
        if (!latestCompletedChallengeDate) {
            return null;
        }

        var latestChallengeWithDate = angular.copy(latestCompletedChallenge);
        latestChallengeWithDate.date = latestCompletedChallengeDate;

        return latestChallengeWithDate;
    };


    //taken from http://stackoverflow.com/a/3177838/373655
    SandboxChallengeCtrl.prototype.timeSince = function(date) {
        if (typeof date !== 'object') {
            date = new Date(date);
        }

        var seconds = Math.floor((new Date() - date) / 1000);
        var intervalType;

        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            intervalType = 'year';
        } else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                intervalType = 'month';
            } else {
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    intervalType = 'day';
                } else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        intervalType = "hour";
                    } else {
                        interval = Math.floor(seconds / 60);
                        if (interval >= 1) {
                            intervalType = "minute";
                        } else {
                            intervalType = "second";
                        }
                    }
                }
            }
        }

        if (interval > 1) {
            intervalType += 's';
        }

        return interval + ' ' + intervalType;
    };

    SandboxChallengeCtrl.prototype.goToChallenge = function(challengeId) {
        window.top.postMessage({cmd: 'setLocation', params: ['#/' + this.group + '/' + challengeId]}, '*');
    };

    SandboxChallengeCtrl.prototype.goToGroup = function(group) {
        window.top.postMessage({cmd: 'setLocation', params: ['#/' + group]}, '*');
    };

    SandboxChallengeCtrl.prototype.getNextChallengeId = function() {
        var curChallengeIndex = this.challengeOrder.indexOf(this.challengeId);

        if (curChallengeIndex > -1 && curChallengeIndex < this.challengeOrder.length) {
            return this.challengeOrder[curChallengeIndex + 1];
        }
        else {
            return undefined;
        }
    }

}());
var TestCase = function($sce, description, expression, expectedValue, getActualValue) {
    this.description = $sce.trustAsHtml(description);

    if (expression) {
        this.expression = $sce.trustAsHtml('<code>' + expression + '</code>');
    }
    else {
        this.expression = $sce.trustAsHtml('n/a');
    }

    this.expectedValue = expectedValue;
    this.getActualValue = getActualValue;
};

TestCase.prototype.isPassing = function() {
    return this.getActualValue() === this.expectedValue;
};
(function() {
    var configApp = angular.module('theSandboxChallenge.config');

    configApp.factory('challengeConfig', function () {
        return {
            challenges: {
                ES6: {
                    blockScopeLet: {
                        jsBin: 'likum',
                        name: 'Block Scopes'
                    },
                    forOfLoops: {
                        jsBin: 'katum',
                        name: 'For...Of Loops'
                    },
                    destructuringArrays: {
                        jsBin: 'fidig',
                        name: 'Destructuring: Arrays'
                    },
                    destructuringSwap: {
                        jsBin: 'sapuyo',
                        name: 'Destructuring: Swap'
                    },
                    destructuringObjects: {
                        jsBin: 'gagebowu',
                        name: 'Destructuring: Objects'
                    },
                    optionalParameters: {
                        jsBin: 'befey',
                        name: 'Optional Parameters'
                    }
                },
                Firebase: {

                }
            },
            order: {
                ES6: ['blockScopeLet', 'forOfLoops', 'optionalParameters', 'destructuringArrays', 'destructuringSwap', 'destructuringObjects'],
                Firebase: []
            }

        }
    });
}());
(function() {

    var app = angular.module('theSandboxChallenge');

    app.filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    });

}());