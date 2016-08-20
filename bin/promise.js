'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Promise = function () {
    _createClass(Promise, [{
        key: 'resolvePromise',

        // internal method
        value: function resolvePromise(y) {
            var _this = this;

            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = y;

                if (Array.isArray(this.nextPromises)) {
                    this.nextPromises.forEach(function (nextPromise, index) {
                        var onFulfilled = _this.onFulfilleds[index];
                        if (typeof onFulfilled === 'function') {
                            var _y = onFulfilled(_y);
                            Promise.Resolve(nextPromise, _this.value);
                            _this.onFulfilleds[index] = null;
                        }
                    });
                }
            }
        }

        // internal method

    }, {
        key: 'rejectPromise',
        value: function rejectPromise(r) {
            var _this2 = this;

            if (this.status === 'pending') {
                this.status = 'rejected';
                this.result = r;
                if (Array.isArray(this.nextPromises)) {
                    this.nextPromises.forEach(function (nextPromise, index) {
                        var onRejected = _this2.onRejecteds[index];
                        if (typeof onRejected === 'function') {
                            var x = onRejected(r);
                            Promise.Resolve(nextPromise, _this2.result);
                            _this2.onRejecteds[index] = null;
                        }
                    });
                }
            }
        }

        // internal method

    }], [{
        key: 'Resolve',
        value: function Resolve(nextPromise, x) {
            if (nextPromise === x) {
                throw new TypeError();
            }
            if (x instanceof Promise) {
                x.then(nextPromise.resolvePromise, nextPromise.rejectPromise);
            }
            if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' || typeof x === 'function') {
                var then = x.then;
                if (typeof then === 'function') {
                    var resolvePromise = nextPromise.resolvePromise.bind(nextPromise);
                    var rejectPromise = nextPromise.rejectPromise.bind(nextPromise);
                    try {
                        then.call(x, resolvePromise, rejectPromise);
                    } catch (e) {
                        nextPromise.rejectPromise(e);
                    }
                } else {
                    nextPromise.resolvePromise(x);
                }
            } else {
                nextPromise.resolvePromise(x);
            }
        }
    }]);

    function Promise(executor) {
        _classCallCheck(this, Promise);

        this.status = 'pending';
        var resolvePromise = this.resolvePromise.bind(this);
        var rejectPromise = this.rejectPromise.bind(this);
        executor(resolvePromise, rejectPromise);
    }

    _createClass(Promise, [{
        key: 'then',
        value: function then(onFulfilled, onRejected) {
            var _this3 = this;

            var nextPromise = new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (_this3.status === 'fulfilled') {
                        var x = onFulfilled(_this3.value);
                        Promise.Resolve(nextPromise, x);
                    } else if (_this3.status === 'rejected') {
                        var _x = onRejected(_this3.result);
                        Promise.Resolve(nextPromise, _x);
                    } else {
                        _this3.onFulfilleds = _this3.onFulfilleds || [];
                        _this3.onRejecteds = _this3.onRejecteds || [];
                        _this3.nextPromises = _this3.nextPromises || [];

                        var length = _this3.nextPromises.length(typeof onFulfilled === 'function') && (_this3.onFulfilleds[length] = onFulfilled)(typeof onRejected === 'function') && (_this3.onRejecteds[length] = onRejected);
                        _this3.nextPromises.push(nextPromise);
                    }
                }, 0);
            });

            return nextPromise;
        }
    }]);

    return Promise;
}();

exports.default = Promise;