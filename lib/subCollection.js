"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var batch_1 = require("./batch");
var index_1 = require("./index");
var SubCollection = /** @class */ (function () {
    function SubCollection(parent) {
        this.objects = [];
        this._insertions = [];
        this._deletions = [];
        this.parent = parent;
    }
    SubCollection.prototype.isSaved = function () {
        return this.parent.isSaved;
    };
    SubCollection.prototype.setParent = function (parent, key) {
        this.parent = parent;
        this.key = key;
        this.path = this.getPath();
        this.reference = this.getReference();
    };
    SubCollection.prototype.getPath = function () {
        return this.parent.path + "/" + this.key;
    };
    SubCollection.prototype.getReference = function () {
        return index_1.firestore.collection(this.getPath());
    };
    SubCollection.prototype.insert = function (newMember) {
        newMember.reference = this.reference.doc(newMember.id);
        this.objects.push(newMember);
        if (this.isSaved()) {
            this._insertions.push(newMember);
        }
    };
    SubCollection.prototype.delete = function (member) {
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
        member.reference = member.getReference();
    };
    SubCollection.prototype.doc = function (id, type, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var snapshot, document_1, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        snapshot = void 0;
                        if (!transaction) return [3 /*break*/, 2];
                        return [4 /*yield*/, transaction.get(this.reference.doc(id))];
                    case 1:
                        snapshot = _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.reference.doc(id).get()];
                    case 3:
                        snapshot = _a.sent();
                        _a.label = 4;
                    case 4:
                        if (snapshot.exists) {
                            document_1 = new type(snapshot.id, {});
                            document_1.setData(snapshot.data());
                            document_1.setParent(this);
                            return [2 /*return*/, document_1];
                        }
                        else {
                            return [2 /*return*/, undefined];
                        }
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    SubCollection.prototype.get = function (type, transaction) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var snapshot, docs, documents, error_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        snapshot = void 0;
                        return [4 /*yield*/, this.reference.get()];
                    case 1:
                        snapshot = _a.sent();
                        docs = snapshot.docs;
                        documents = docs.map(function (documentSnapshot) {
                            var document = new type(documentSnapshot.id, {});
                            document.setData(documentSnapshot.data());
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
    SubCollection.prototype.contains = function (id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var snapshot, error_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reference.doc(id).get()];
                    case 1:
                        snapshot = _a.sent();
                        return [2 /*return*/, snapshot.exists];
                    case 2:
                        error_3 = _a.sent();
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SubCollection.prototype.forEach = function (callbackfn, thisArg) {
        this.objects.forEach(callbackfn);
    };
    SubCollection.prototype.pack = function (type, batchID, writeBatch) {
        var _this = this;
        var _writeBatch = writeBatch || index_1.firestore.batch();
        var _batch = new batch_1.Batch(_writeBatch);
        var self = this;
        switch (type) {
            case batch_1.BatchType.save:
                this.forEach(function (document) {
                    var reference = self.reference.doc(document.id);
                    if (document.isSaved) {
                        _batch.set(reference, document.value());
                    }
                    else {
                        _batch.set(reference, document.value(), { merge: true });
                    }
                });
                return _batch.batch();
            case batch_1.BatchType.update:
                var insertions = this._insertions.filter(function (item) { return _this._deletions.indexOf(item) < 0; });
                insertions.forEach(function (document) {
                    var reference = self.reference.doc(document.id);
                    _batch.set(reference, document.value(), { merge: true });
                });
                var deletions = this._deletions.filter(function (item) { return _this._insertions.indexOf(item) < 0; });
                deletions.forEach(function (document) {
                    var reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
            case batch_1.BatchType.delete:
                this.forEach(function (document) {
                    var reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch.batch();
        }
    };
    SubCollection.prototype.batch = function (type, batchID) {
        this.forEach(function (document) {
            document.batch(type, batchID);
        });
    };
    return SubCollection;
}());
exports.SubCollection = SubCollection;
//# sourceMappingURL=subCollection.js.map