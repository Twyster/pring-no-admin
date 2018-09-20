import * as tslib_1 from "tslib";
export class Option {
    constructor() {
        this.timeout = 10;
    }
}
export var Change;
(function (Change) {
    Change["initial"] = "initial";
    Change["update"] = "update";
    Change["error"] = "error";
})(Change || (Change = {}));
export class CollectionChange {
    constructor(type, insertions, modifications, deletions) {
        this.insertions = [];
        this.modifications = [];
        this.deletions = [];
        this.type = type;
        this.insertions = insertions;
        this.modifications = modifications;
        this.deletions = deletions;
    }
}
export class DataSource {
    constructor(query, option = new Option(), type) {
        this.documents = [];
        this.query = query;
        this.option = option;
        this._Element = type;
    }
    doc(index) {
        return this.documents[index];
    }
    on(block) {
        this.changeBlock = block;
        return this;
    }
    onError(block) {
        this.errorBlock = block;
        return this;
    }
    onCompleted(block) {
        this.completedBlock = block;
        return this;
    }
    listen() {
        let isFirst = true;
        this.query.listen({
            next: (snapshot) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (isFirst) {
                    yield this._operate(snapshot, isFirst);
                    isFirst = false;
                }
                else {
                    yield this._operate(snapshot, isFirst);
                }
            }),
            error: (error) => {
                if (this.errorBlock) {
                    this.errorBlock(error);
                }
            },
            complete: () => {
                if (this.completedBlock) {
                    this.completedBlock(this.documents);
                }
            }
        });
        return this;
    }
    get() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.query.get();
            const docs = snapshot.docs;
            const promises = docs.map((doc) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                return yield this._get(doc.id, doc.data());
            }));
            return Promise.all(promises);
        });
    }
    _operate(snapshot, isFirst) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let changes = [];
            changes = snapshot.docChanges();
            changes.forEach((change) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const id = change.doc.id;
                switch (change.type) {
                    case 'added': {
                        const document = yield this._get(change.doc.id, change.doc.data());
                        this.documents.push(document);
                        this.documents = this.documents.sort(this.option.sortBlock);
                        if (!isFirst) {
                            const IDs = this.documents.map(doc => doc.id);
                            if (IDs.includes(id)) {
                                const index = IDs.indexOf(id);
                                if (this.changeBlock) {
                                    const collectionChange = new CollectionChange(Change.update, [index], [], []);
                                    this.changeBlock(snapshot, collectionChange);
                                }
                            }
                        }
                        break;
                    }
                    case 'modified': {
                        const document = yield this._get(change.doc.id, change.doc.data());
                        this.documents = this.documents.filter(doc => doc.id !== id);
                        this.documents.push(document);
                        this.documents = this.documents.sort(this.option.sortBlock);
                        const IDs = this.documents.map(doc => doc.id);
                        if (IDs.includes(id)) {
                            const index = IDs.indexOf(id);
                            if (this.changeBlock) {
                                const collectionChange = new CollectionChange(Change.update, [], [index], []);
                                this.changeBlock(snapshot, collectionChange);
                            }
                        }
                        break;
                    }
                    case 'removed': {
                        this.documents = this.documents.filter(doc => doc.id !== id);
                        this.documents = this.documents.sort(this.option.sortBlock);
                        const IDs = this.documents.map(doc => doc.id);
                        if (IDs.includes(id)) {
                            const index = IDs.indexOf(id);
                            if (this.changeBlock) {
                                const collectionChange = new CollectionChange(Change.update, [], [], [index]);
                                this.changeBlock(snapshot, collectionChange);
                            }
                        }
                        break;
                    }
                }
            }));
            if (isFirst) {
                if (this.changeBlock) {
                    const collectionChange = new CollectionChange(Change.initial, [], [], []);
                    this.changeBlock(snapshot, collectionChange);
                }
            }
        });
    }
    _get(id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this.query.isReference) {
                const document = new this._Element(id, {});
                yield document.fetch();
                return document;
            }
            else {
                const document = new this._Element(id, data);
                return document;
            }
        });
    }
}
//# sourceMappingURL=dataSource.js.map