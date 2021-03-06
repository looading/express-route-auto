"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("../../../");
var List = (function (_super) {
    __extends(List, _super);
    function List() {
        var _this = _super.call(this) || this;
        _this.params = {
            get: ['id']
        };
        _this.post = function (req, res, next) {
            res.send('this is list ::post!');
        };
        _this.get = [
            function (req, res, next) {
                console.log("some want get test list : " + req.params.id);
                next();
            },
            function (req, res, next) {
                res.json({
                    'list-id': req.params.id
                });
            }
        ];
        return _this;
    }
    return List;
}(_1.Action));
module.exports = new List();
