"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rtdb = exports.fireStore = void 0;
require("dotenv/config");
var admin = require("firebase-admin");
var serviceAccount = JSON.parse(process.env.DB_CREDENTIAL);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
});
var fireStore = admin.firestore();
exports.fireStore = fireStore;
var rtdb = admin.database();
exports.rtdb = rtdb;
