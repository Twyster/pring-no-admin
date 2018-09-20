"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var batch_1 = require("./batch");
var index_1 = require("./index");
var subCollection_1 = require("./subCollection");
var ReferenceCollection = /** @class */ (function (_super) {
    tslib_1.__extends(ReferenceCollection, _super);
    function ReferenceCollection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReferenceCollection.prototype.nsert = function (newMember) {
        this.objects.push(newMember);
        if (this.isSaved()) {
            this._insertions.push(newMember);
        }
    };
    ReferenceCollection.prototype.delete = function (member) {
        var _this = this;
        this.objects.some(function (v, i) {
            if (v.id === member.id) {
                _this.objects.splice(i, 1);
                return true;
            }
            return false;
        });
        if (this.isSaved()) {
            this._deletions.push(member);
        }
    };
    ReferenceCollection.prototype.pack = function (type, batchID, writeBatch) {
        var _this = this;
        var _writeBatch = writeBatch || index_1.firestore.batch();
        var _batch = new batch_1.Batch(_writeBatch);
        switch (type) {
            case batch_1.BatchType.save: {
                this.forEach(function (document) {
                    var value = {};
                    if (document.shouldBeReplicated()) {
                        value = document.value();
                    }
                    value.createdAt = index_1.timestamp;
                    value.updatedAt = index_1.timestamp;
                    if (!document.isSaved) {
                        _batch.set(document.getReference(), document.value(), { merge: true });
                    }
                    var reference = _this.reference.doc(document.id);
                    _batch.set(reference, value, { merge: true });
                });
                return _batch.batch();
            }
            case batch_1.BatchType.update:
                var insertions = this._insertions.filter(function (item) { return _this._deletions.indexOf(item) < 0; });
                insertions.forEach(function (document) {
                    var value = {};
                    if (document.isSaved) {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        if (document.createdAt) {
                            value.createdAt = document.createdAt;
                        }
                        value.updatedAt = index_1.timestamp;
                        _batch.set(document.getReference(), document.value(), { merge: true });
                    }
                    else {
                        if (document.shouldBeReplicated()) {
                            value = document.value();
                        }
                        value.createdAt = index_1.timestamp;
                        value.updatedAt = index_1.timestamp;
                    }
                    var reference = _this.reference.doc(document.id);
                    _batch.set(reference, value, { merge: true });
                });
                var deletions = this._deletions.filter(function (item) { return _this._insertions.indexOf(item) < 0; });
                deletions.forEach(function (document) {
                    var reference = _this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
            case batch_1.BatchType.delete:
                this.forEach(function (document) {
                    var reference = _this.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
        }
    };
    ReferenceCollection.prototype.doc = function (id, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var document_1, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        document_1 = new type(id, {});
                        return [4 /*yield*/, document_1.fetch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, document_1];
                    case 2:
                        error_1 = _a.sent();
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ReferenceCollection.prototype.get = function (type) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var snapshot, docs, documents, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reference.get()];
                    case 1:
                        snapshot = _a.sent();
                        docs = snapshot.docs;
                        documents = docs.map(function (documentSnapshot) {
                            var document = new type(documentSnapshot.id, {});
                            return document;
                        });
                        this.objects = documents;
                        return [2 /*return*/, documents];
                    case 2:
                        error_2 = _a.sent();
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return ReferenceCollection;
}(subCollection_1.SubCollection));
exports.ReferenceCollection = ReferenceCollection;
//# sourceMappingURL=referenceCollection.js.map