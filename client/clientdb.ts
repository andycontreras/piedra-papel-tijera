import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIAL as any);
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let _API: string;
if (process.env.NODE_ENV == 'production') {
	_API = '';
} else {
	_API = 'http://localhost:3005';
}

export { _API, db };
