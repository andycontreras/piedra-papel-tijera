import * as express from 'express';
import * as cors from 'cors';
import { rtdb, fireStore } from './db';
import { customAlphabet } from 'nanoid';
import path from 'path';

//Inicializamos el servidor
const app = express();
const port = process.env.PORT || 3005;
//Solicitamos users y rooms de fireStore
const userColl = fireStore.collection('users');
const roomsColl = fireStore.collection('rooms');
//Configuramos nanoID
const nano = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 10);
const newID = nano(6);

app.use(path.join(__dirname, '../dist'));
app.use(cors());
app.use(express.json());

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});
//Endpoint checked
app.post('/signup', async (req, res) => {
	const { email, name } = req.body;
	const reqEmail = await userColl.where('email', '==', email).get();
	const reqName = await userColl.where('name', '==', name).get();
	let eEmail = !reqEmail.empty;
	let eName = !reqName.empty;

	switch (true) {
		case eEmail && eName:
			res.status(400).json({ message: 'The user exists!' });
			break;
		case eEmail:
			res.status(400).json({ message: 'The email already exists!' });
			break;
		case eName:
			res.status(400).json({ message: 'The name already exists!' });
			break;
		default:
			const newUser = {
				name: name,
				email: email,
				Rate: {
					wins: 0,
					lose: 0,
				},
			};
			const usrRef = userColl.doc();
			await usrRef.set(newUser);
			res.status(200).json({
				usrID: usrRef.id,
				name: name,
				email: email,
			});
	}
});
//Endpoint checked
app.post('/login', async (req, res) => {
	const { email } = req.body;
	const reqEmail = await userColl.where('email', '==', email).get();
	let vEmail = !reqEmail.empty;

	switch (false) {
		case vEmail:
			res.status(400).json({
				message: "The user doesn't exist",
			});
			break;
		default:
			reqEmail.forEach((doc) => {
				res.status(200).json({
					usrID: doc.id,
					usrName: doc.data().name,
					usrEmail: doc.data().email,
				});
			});
	}
});
//Endpoint checked
app.post('/create-room', async (req, res) => {
	const { usrID } = req.body;
	const snap = await userColl.doc(usrID).get();

	const roomData = {
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
	const roomRTDB = {
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

	if (!snap.exists) {
		res.status(404).json({
			message: "Can't create new room",
		});
	} else {
		const roomRef = roomsColl.doc();
		await roomRef.set(roomData);
		const privateID = roomRef.id;

		const rtdbRef = rtdb.ref(`rooms/${privateID}`);
		await rtdbRef.set(roomRTDB);

		res.status(201).json({
			privateID: privateID,
			publicID: newID,
		});
	}
});
//Endpoint checked
app.post('/room/:id/join', async (req, res) => {
	const { puID, usrName } = req.body;
	const roomRef = await roomsColl.where('publicID', '==', puID).get();
	if (roomRef.empty) {
		res.status(404).json({
			message: "The room doesn't exist!",
		});
	} else {
		const roomID = roomRef.docs[0].id;
		const rtdbRef = await rtdb.ref(`rooms/${roomID}`);
		//Update FS
		await roomsColl.doc(roomID).update({
			'players.guest': usrName,
		});
		//Update RTDB
		await rtdbRef.child('players').update({
			guest: usrName,
			gOnline: true,
		});

		roomRef.forEach((doc) => {
			res.status(201).json({
				message: 'Joined succesfully',
				privateID: doc.id,
				owner: doc.data().players.owner,
				oOnline: doc.data().players.oOnline,
			});
		});
	}
});
//Endpoint checked
app.put('/room/:privateID/play', async (req, res) => {
	const { userData } = req.body;
	const user = await userColl.doc(userData.usrID).get();
	const child = await rtdb.ref(`rooms/${userData.privateID}/players`);
	const owner = (await child.get()).val().owner;
	if ((await child.get()).exists && user.exists) {
		if (userData.usrName === owner) {
			await child.update({ oReady: true });
		} else {
			await child.update({ gReady: true });
		}

		res.status(201).json({
			message: 'Save status. OK.',
		});
	} else {
		res.status(404).json({
			message: `The room doesn't exist`,
		});
	}
});
//Endpoint checked
app.put('/room/:privateID/move', async (req, res) => {
	const { userData, move } = req.body;
	const child = await rtdb.ref(`rooms/${userData.privateID}/players`);
	const { owner, guest } = (await child.get()).val();
	if (userData.usrName === owner) {
		child.update({ oMove: move });
		res.status(201).json({ message: 'Owner move updated' });
	} else if (userData.usrName === guest) {
		child.update({ gMove: move });
		res.status(201).json({ message: 'Guest move updated' });
	} else {
		res.status(404).json({ message: 'User not founds' });
	}
});
//Endpoint checked
app.put('/:privateID/save-scoreboard', async (req, res) => {
	const { currentState, userData } = req.body;
	const child = await rtdb.ref(`rooms/${userData.privateID}/players`);
	const rtdbGet = await child.get();
	const room = await roomsColl.doc(userData.privateID).get();

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
	} else {
		res.status(404).json({
			message: 'Cannot update',
		});
	}
});
//Endpoint checked
app.put(`/:privateID/set-online`, async (req, res) => {
	const { userData } = req.body;
	const child = await rtdb.ref(`rooms/${userData.privateID}/players`);
	const { owner, guest } = (await child.get()).val();
	if (userData.usrName === owner) {
		child.update({ oOnline: true });
		res.status(201).json({ message: 'Successful online user update' });
	} else if (userData.usrName === guest) {
		child.update({ gOnline: true });
		res.status(201).json({ message: 'Successful online user update' });
	} else {
		res.status(404).json({ message: 'Cannot update, user not found.' });
	}
});
//Endpoint checked
app.delete('/delete-room/', async (req, res) => {
	const { roomID, usrID } = req.query;
	const user = await userColl.doc(usrID as any).get();
	if (user.exists) {
		await roomsColl.doc(roomID as any).delete();
		await rtdb.ref(`rooms/${roomID}`).remove();
		res.status(201).json({
			message: 'Room deleted correctly',
		});
	} else {
		res.status(400).json({
			message: 'Cannot delete this room',
		});
	}
});
//Endpoint checked
app.listen(port, () => {
	console.log(`Listening on http://localhost:${port}`);
});
