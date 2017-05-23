"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require('debug')('express-route-auto:props');
var store = {
    props: (function () {
        function class_1() {
        }
        return class_1;
    }())
};
exports.Config = {
    add: function (props) {
        log('add props %s', props);
        var Props = (function () {
            function Props() {
                var _this = this;
                Object.keys(props).map(function (key) {
                    _this[key] = props[key];
                });
            }
            return Props;
        }());
        store.props = Props;
        return props;
    },
    get: function () {
        log('get config %s', store['props']);
        return store['props'];
    },
};
