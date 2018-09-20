"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dataSource_1 = require("./dataSource");
var Query = /** @class */ (function () {
    function Query(reference, isReference) {
        if (isReference === void 0) { isReference = false; }
        this.reference = reference;
        this.query = reference;
        this.isReference = isReference;
    }
    Query.prototype.dataSource = function (type, option) {
        if (option === void 0) { option = new dataSource_1.Option(); }
        return new dataSource_1.DataSource(this, option, type);
    };
    Query.prototype.listen = function (observer) {
        return this.query.onSnapshot(observer);
    };
    Query.prototype.where = function (fieldPath, opStr, value) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.where(fieldPath, opStr, value);
        return query;
    };
    Query.prototype.orderBy = function (fieldPath, directionStr) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.orderBy(fieldPath, directionStr);
        return query;
    };
    Query.prototype.limit = function (limit) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.limit(limit);
        return query;
    };
    Query.prototype.startAt = function (arg) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.startAt(arg);
        return query;
    };
    Query.prototype.startAfter = function (arg) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.startAfter(arg);
        return query;
    };
    Query.prototype.endBefore = function (arg) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.endBefore(arg);
        return query;
    };
    Query.prototype.endAt = function (arg) {
        var query = new Query(this.reference, this.isReference);
        query.query = this.query.endAt(arg);
        return query;
    };
    Query.prototype.get = function (options) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query.get(options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Query;
}());
exports.Query = Query;
//# sourceMappingURL=query.js.map