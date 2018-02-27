"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FirebaseFirestore = require("@google-cloud/firestore");
require("reflect-metadata");
const index_1 = require("./index");
const base_1 = require("./base");
const subCollection_1 = require("./subCollection");
class ReferenceCollection extends subCollection_1.SubCollection {
    insert(newMember) {
        this.parent._init();
        this.objects.push(newMember);
        if (this.isSaved()) {
            this._insertions.push(newMember);
        }
    }
    delete(member) {
        this.parent._init();
        this.objects.some((v, i) => {
            if (v.id === member.id) {
                this.objects.splice(i, 1);
                return true;
            }
            return false;
        });
        if (this.isSaved()) {
            this._deletions.push(member);
        }
    }
    pack(type, batch) {
        const _batch = batch || index_1.firestore.batch();
        const self = this;
        switch (type) {
            case base_1.BatchType.save: {
                const updateValue = {
                    createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
                    updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                };
                this.forEach(document => {
                    if (!document.isSaved) {
                        _batch.set(document.reference, document.value());
                    }
                    const reference = self.reference.doc(document.id);
                    _batch.set(reference, updateValue);
                });
                return _batch;
            }
            case base_1.BatchType.update:
                const insertions = this._insertions.filter(item => this._deletions.indexOf(item) < 0);
                insertions.forEach(document => {
                    const updateValue = {
                        updatedAt: FirebaseFirestore.FieldValue.serverTimestamp()
                    };
                    if (!document.isSaved) {
                        updateValue["createdAt"] = FirebaseFirestore.FieldValue.serverTimestamp();
                        _batch.set(document.reference, document.value());
                    }
                    const reference = self.reference.doc(document.id);
                    _batch.set(reference, updateValue);
                });
                const deletions = this._deletions.filter(item => this._insertions.indexOf(item) < 0);
                deletions.forEach(document => {
                    const reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch;
            case base_1.BatchType.delete:
                this.forEach(document => {
                    const reference = self.reference.doc(document.id);
                    _batch.delete(reference);
                });
                return _batch;
        }
    }
    get(type) {
        return __awaiter(this, void 0, void 0, function* () {
            this.parent._init();
            try {
                const snapshot = yield this.reference.get();
                const docs = snapshot.docs;
                const documents = docs.map((documentSnapshot) => {
                    const document = new type(documentSnapshot.id);
                    return document;
                });
                this.objects = documents;
                return documents;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ReferenceCollection = ReferenceCollection;
//# sourceMappingURL=referenceCollection.js.map