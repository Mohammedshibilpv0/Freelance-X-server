
import admin from 'firebase-admin';
import * as serviceAccount from './fir-87d6a-firebase-adminsdk-j32ju-f886c86b6b.json';
import { FIREBASEBUCKET } from '../config/env';

console.log('FIREBASEBUCKET',FIREBASEBUCKET)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'fir-87d6a.appspot.com/',
});

const bucket = admin.storage().bucket();
export { bucket };
