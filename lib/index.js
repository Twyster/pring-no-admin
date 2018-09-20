import { BatchType } from './batch';
import { Base, property } from './base';
import { SubCollection } from './subCollection';
import { NestedCollection } from './nestedCollection';
import { ReferenceCollection } from './referenceCollection';
import { File } from './file';
export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File };
export let firestore;
export let timestamp;
export const initialize = (appFirestore, serverTimestamp) => {
    firestore = appFirestore;
    firestore.settings({ timestampsInSnapshots: true });
    timestamp = serverTimestamp;
};
//# sourceMappingURL=index.js.map