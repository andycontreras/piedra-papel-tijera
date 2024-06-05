import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = JSON.parse(process.env.FIREBASE_CREDENTIAL as any);

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const _API = process.env.PORT || 'http://localhost:3005';
