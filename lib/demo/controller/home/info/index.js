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
var _1 = require("../../../../");
var Index = (function (_super) {
    __extends(Index, _super);
    function Index() {
        return _super.call(this) || this;
    }
    Index.prototype._post = function (req, res, next) {
        res.send('this is / ::post!');
    };
    Index.prototype._get = function (req, res, next) {
        res.send('this is / ::get!');
    };
    return Index;
}(_1.Action));
module.exports = new Index();
