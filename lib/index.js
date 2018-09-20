"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var batch_1 = require("./batch");
exports.BatchType = batch_1.BatchType;
var base_1 = require("./base");
exports.Base = base_1.Base;
exports.property = base_1.property;
var subCollection_1 = require("./subCollection");
exports.SubCollection = subCollection_1.SubCollection;
var nestedCollection_1 = require("./nestedCollection");
exports.NestedCollection = nestedCollection_1.NestedCollection;
var referenceCollection_1 = require("./referenceCollection");
exports.ReferenceCollection = referenceCollection_1.ReferenceCollection;
var file_1 = require("./file");
exports.File = file_1.File;
exports.initialize = function (appFirestore, serverTimestamp) {
    exports.firestore = appFirestore;
    exports.firestore.settings({ timestampsInSnapshots: true });
    exports.timestamp = serverTimestamp;
};
//# sourceMappingURL=index.js.map