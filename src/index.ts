import * as FirebaseFirestore from '@google-cloud/firestore'
import * as firebase from 'firebase'
import { BatchType } from './batch'
import { Firestore, FieldValue, Base, property } from './base'
import { SubCollection } from './subCollection'
import { NestedCollection } from './nestedCollection'
import { ReferenceCollection } from './referenceCollection'
import { File } from './file'

export { BatchType, Base, property, SubCollection, NestedCollection, ReferenceCollection, File }

export let firestore: Firestore

export let timestamp: FieldValue

export const initialize = (appFirestore: Firestore, serverTimestamp: FieldValue) => {
    firestore = appFirestore
    if (firestore instanceof FirebaseFirestore.Firestore) {
        firestore.settings({timestampsInSnapshots: true})
    } else {
        firestore.settings({timestampsInSnapshots: true})
    }
    timestamp = serverTimestamp
}
