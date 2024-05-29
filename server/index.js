"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var db_1 = require("./db");
var nanoid_1 = require("nanoid");
//Inicializamos el servidor
var app = express();
var port = process.env.PORT || 3005;
//Solicitamos users y rooms de fireStore
var userColl = db_1.fireStore.collection('users');
var roomsColl = db_1.fireStore.collection('rooms');
//Configuramos nanoID
var nano = (0, nanoid_1.customAlphabet)('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 10);
var newID = nano(6);
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.get('*', function (req, res) {
    res.sendFile('../dist/index.html');
});
//Endpoint checked
app.post('/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name, reqEmail, reqName, eEmail, eName, _b, newUser, usrRef;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, email = _a.email, name = _a.name;
                return [4 /*yield*/, userColl.where('email', '==', email).get()];
            case 1:
                reqEmail = _c.sent();
                return [4 /*yield*/, userColl.where('name', '==', name).get()];
            case 2:
                reqName = _c.sent();
                eEmail = !reqEmail.empty;
                eName = !reqName.empty;
                _b = true;
                switch (_b) {
                    case eEmail && eName: return [3 /*break*/, 3];
                    case eEmail: return [3 /*break*/, 4];
                    case eName: return [3 /*break*/, 5];
                }
                return [3 /*break*/, 6];
            case 3:
                res.status(400).json({ message: 'The user exists!' });
                return [3 /*break*/, 8];
            case 4:
                res.status(400).json({ message: 'The email already exists!' });
                return [3 /*break*/, 8];
            case 5:
                res.status(400).json({ message: 'The name already exists!' });
                return [3 /*break*/, 8];
            case 6:
                newUser = {
                    name: name,
                    email: email,
                    Rate: {
                        wins: 0,
                        lose: 0,
                    },
                };
                usrRef = userColl.doc();
                return [4 /*yield*/, usrRef.set(newUser)];
            case 7:
                _c.sent();
                res.status(200).json({
                    usrID: usrRef.id,
                    name: name,
                    email: email,
                });
                _c.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, reqEmail, vEmail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, userColl.where('email', '==', email).get()];
            case 1:
                reqEmail = _a.sent();
                vEmail = !reqEmail.empty;
                switch (false) {
                    case vEmail:
                        res.status(400).json({
                            message: "The user doesn't exist",
                        });
                        break;
                    default:
                        reqEmail.forEach(function (doc) {
                            res.status(200).json({
                                usrID: doc.id,
                                usrName: doc.data().name,
                                usrEmail: doc.data().email,
                            });
                        });
                }
                return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.post('/create-room', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var usrID, snap, roomData, roomRTDB, roomRef, privateID, rtdbRef;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                usrID = req.body.usrID;
                return [4 /*yield*/, userColl.doc(usrID).get()];
            case 1:
                snap = _a.sent();
                roomData = {
                    publicID: newID,
                    usrID: usrID,
                    players: {
                        owner: snap.data().name,
                        ownerScore: 0,
                        guest: '',
                        guestScore: 0,
                    },
                    rate: {
                        ownerWins: 0,
                        guestWins: 0,
                    },
                };
                roomRTDB = {
                    publicID: newID,
                    players: {
                        owner: snap.data().name,
                        oScore: 0,
                        oMove: '',
                        oOnline: true,
                        oReady: false,
                        guest: '',
                        gScore: 0,
                        gMove: '',
                        gOnline: false,
                        gReady: false,
                    },
                    rate: {
                        ownerWins: 0,
                        guestWins: 0,
                    },
                };
                if (!!snap.exists) return [3 /*break*/, 2];
                res.status(404).json({
                    message: "Can't create new room",
                });
                return [3 /*break*/, 5];
            case 2:
                roomRef = roomsColl.doc();
                return [4 /*yield*/, roomRef.set(roomData)];
            case 3:
                _a.sent();
                privateID = roomRef.id;
                rtdbRef = db_1.rtdb.ref("rooms/".concat(privateID));
                return [4 /*yield*/, rtdbRef.set(roomRTDB)];
            case 4:
                _a.sent();
                res.status(201).json({
                    privateID: privateID,
                    publicID: newID,
                });
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.post('/room/:id/join', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, puID, usrName, roomRef, roomID, rtdbRef;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, puID = _a.puID, usrName = _a.usrName;
                return [4 /*yield*/, roomsColl.where('publicID', '==', puID).get()];
            case 1:
                roomRef = _b.sent();
                if (!roomRef.empty) return [3 /*break*/, 2];
                res.status(404).json({
                    message: "The room doesn't exist!",
                });
                return [3 /*break*/, 6];
            case 2:
                roomID = roomRef.docs[0].id;
                return [4 /*yield*/, db_1.rtdb.ref("rooms/".concat(roomID))];
            case 3:
                rtdbRef = _b.sent();
                //Update FS
                return [4 /*yield*/, roomsColl.doc(roomID).update({
                        'players.guest': usrName,
                    })];
            case 4:
                //Update FS
                _b.sent();
                //Update RTDB
                return [4 /*yield*/, rtdbRef.child('players').update({
                        guest: usrName,
                        gOnline: true,
                    })];
            case 5:
                //Update RTDB
                _b.sent();
                roomRef.forEach(function (doc) {
                    res.status(201).json({
                        message: 'Joined succesfully',
                        privateID: doc.id,
                        owner: doc.data().players.owner,
                        oOnline: doc.data().players.oOnline,
                    });
                });
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.put('/room/:privateID/play', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, user, child, owner;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userData = req.body.userData;
                return [4 /*yield*/, userColl.doc(userData.usrID).get()];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, db_1.rtdb.ref("rooms/".concat(userData.privateID, "/players"))];
            case 2:
                child = _a.sent();
                return [4 /*yield*/, child.get()];
            case 3:
                owner = (_a.sent()).val().owner;
                return [4 /*yield*/, child.get()];
            case 4:
                if (!((_a.sent()).exists && user.exists)) return [3 /*break*/, 9];
                if (!(userData.usrName === owner)) return [3 /*break*/, 6];
                return [4 /*yield*/, child.update({ oReady: true })];
            case 5:
                _a.sent();
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, child.update({ gReady: true })];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                res.status(201).json({
                    message: 'Save status. OK.',
                });
                return [3 /*break*/, 10];
            case 9:
                res.status(404).json({
                    message: "The room doesn't exist",
                });
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.put('/room/:privateID/move', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userData, move, child, _b, owner, guest;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, userData = _a.userData, move = _a.move;
                return [4 /*yield*/, db_1.rtdb.ref("rooms/".concat(userData.privateID, "/players"))];
            case 1:
                child = _c.sent();
                return [4 /*yield*/, child.get()];
            case 2:
                _b = (_c.sent()).val(), owner = _b.owner, guest = _b.guest;
                if (userData.usrName === owner) {
                    child.update({ oMove: move });
                    res.status(201).json({ message: 'Owner move updated' });
                }
                else if (userData.usrName === guest) {
                    child.update({ gMove: move });
                    res.status(201).json({ message: 'Guest move updated' });
                }
                else {
                    res.status(404).json({ message: 'User not founds' });
                }
                return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.put('/:privateID/save-scoreboard', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentState, userData, child, rtdbGet, room;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, currentState = _a.currentState, userData = _a.userData;
                return [4 /*yield*/, db_1.rtdb.ref("rooms/".concat(userData.privateID, "/players"))];
            case 1:
                child = _b.sent();
                return [4 /*yield*/, child.get()];
            case 2:
                rtdbGet = _b.sent();
                return [4 /*yield*/, roomsColl.doc(userData.privateID).get()];
            case 3:
                room = _b.sent();
                if (rtdbGet.exists && room.exists) {
                    child.update({
                        oScore: currentState.ownerScore,
                        oOnline: false,
                        oReady: false,
                        gScore: currentState.guestScore,
                        gOnline: false,
                        gReady: false,
                    });
                    roomsColl.doc(userData.privateID).update({
                        'players.ownerScore': currentState.ownerScore,
                        'players.guestScore': currentState.guestScore,
                    });
                    res.status(201).json({
                        message: "It's alright ",
                    });
                }
                else {
                    res.status(404).json({
                        message: 'Cannot update',
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.put("/:privateID/set-online", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, child, _a, owner, guest;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userData = req.body.userData;
                return [4 /*yield*/, db_1.rtdb.ref("rooms/".concat(userData.privateID, "/players"))];
            case 1:
                child = _b.sent();
                return [4 /*yield*/, child.get()];
            case 2:
                _a = (_b.sent()).val(), owner = _a.owner, guest = _a.guest;
                if (userData.usrName === owner) {
                    child.update({ oOnline: true });
                    res.status(201).json({ message: 'Successful online user update' });
                }
                else if (userData.usrName === guest) {
                    child.update({ gOnline: true });
                    res.status(201).json({ message: 'Successful online user update' });
                }
                else {
                    res.status(404).json({ message: 'Cannot update, user not found.' });
                }
                return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.delete('/delete-room/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, roomID, usrID, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, roomID = _a.roomID, usrID = _a.usrID;
                return [4 /*yield*/, userColl.doc(usrID).get()];
            case 1:
                user = _b.sent();
                if (!user.exists) return [3 /*break*/, 4];
                return [4 /*yield*/, roomsColl.doc(roomID).delete()];
            case 2:
                _b.sent();
                return [4 /*yield*/, db_1.rtdb.ref("rooms/".concat(roomID)).remove()];
            case 3:
                _b.sent();
                res.status(201).json({
                    message: 'Room deleted correctly',
                });
                return [3 /*break*/, 5];
            case 4:
                res.status(400).json({
                    message: 'Cannot delete this room',
                });
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
//Endpoint checked
app.listen(port, function () {
    console.log("Listening on http://localhost:".concat(port));
});
