import 'dotenv/config';
import * as admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: process.env.DATABASE_URL,
});
const fireStore = admin.firestore();
const rtdb = admin.database();

export { fireStore, rtdb };
