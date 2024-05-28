import 'dotenv/config';
import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.DB_CREDENTIAL);
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount as any),
	databaseURL: process.env.DATABASE_URL as any,
});
const fireStore = admin.firestore();
const rtdb = admin.database();

export { fireStore, rtdb };
