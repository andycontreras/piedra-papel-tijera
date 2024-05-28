import { ref, onValue, get, child, set } from 'firebase/database';
import { db, _API } from './clientdb';

type Play = 'rock' | 'paper' | 'scissors' | '';

const state = {
	data: {
		userData: {
			usrID: '',
			usrName: '',
			usrEmail: '',
			publicID: '',
			privateID: '',
		},
		currentState: {
			owner: '',
			ownerScore: 0,
			ownerMove: '',
			guest: '',
			guestScore: 0,
			guestMove: '',
			winner: '',
		},
		gameState: {
			oOnline: false,
			oReady: false,
			gOnline: false,
			gReady: false,
		},
	},

	async init() {
		const localState = localStorage.getItem('localState');
		if (window.location.pathname === '/auth') {
			localStorage.removeItem('localState');
		} else if (localState) {
			this.data = JSON.parse(localState);
		}
	},

	saveState(newState) {
		this.data = { ...this.data, ...newState };
		localStorage.setItem('localState', JSON.stringify(this.data));
	},

	//Function checked
	async setUser(ID, name, email) {
		let { userData } = this.getState();

		userData.usrID = ID;
		userData.usrName = name;
		userData.usrEmail = email;

		this.saveState({ userData });
	},
	//Function checked
	async signup(email, name) {
		const response = await fetch(`${_API}/signup`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, name }),
		});

		const usrData = await response.json();
		if (!response.ok) {
			window.alert(`${usrData.message}`);
			return false;
		} else {
			let ID = usrData.usrID;
			this.setUser(ID, name, email);
			return true;
		}
	},
	//Function checked
	async login(email) {
		const response = await fetch(`${_API}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email }),
		});

		const usrData = await response.json();
		if (!response.ok) {
			window.alert(usrData.message);
			return false;
		} else {
			let ID = usrData.usrID;
			let name = usrData.usrName;
			this.setUser(ID, name, email);
			return true;
		}
	},
	//Function checked
	async createRoom(usrID) {
		const data = this.getState();
		const response = await fetch(`${_API}/create-room`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ usrID }),
		});

		const roomData = await response.json();
		let puID = roomData.publicID;
		let prID = roomData.privateID;

		if (!response.ok) {
			window.alert(roomData.message);
			return false;
		} else {
			data.userData.publicID = puID;
			data.userData.privateID = prID;
			data.currentState.owner = data.userData.usrName;
			data.gameState.oOnline = true;
			this.saveState(data);
			return true;
		}
	},
	//Function checked
	async joinRoom(puID, name) {
		const response = await fetch(`${_API}/room/${puID}/join`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ puID: puID, usrName: name }),
		});

		const data = this.getState();
		const roomData = await response.json();

		if (!response.ok) {
			window.alert(roomData.message);
			return false;
		} else {
			data.userData.publicID = puID;
			data.userData.privateID = roomData.privateID;
			data.currentState.owner = roomData.owner;
			data.currentState.guest = name;
			data.gameState.oOnline = roomData.oOnline;
			data.gameState.gOnline = true;
			this.saveState(data);
			return true;
		}
	},
	//Function checked
	async waitOpponent(path) {
		const { userData } = this.getState();
		const rtdbRef = await ref(db, `rooms/${userData.privateID}/players`);
		onValue(rtdbRef, async (snap) => {
			const dt = this.getState();
			const data = snap.val();
			const gOnline = Object.values(data)[1];
			const guest = Object.values(data)[4];

			if (gOnline) {
				dt.gameState.gOnline = gOnline;
				dt.gameState.oOnline = true;
				dt.currentState.guest = guest;
				this.saveState(dt);
				await path();
			}
		});
	},
	//Function checked
	async setReadyStatus() {
		const { userData } = this.getState();
		const response = await fetch(`${_API}/room/${userData.privateID}/play`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userData }),
		});

		const roomData = await response.json();
		if (!response.ok) {
			window.alert(roomData.message);
			return false;
		} else {
			return true;
		}
	},
	//Function checked
	async watchReadyStatus(path) {
		const { userData } = this.getState();
		const rtdbRef = await ref(db, `rooms/${userData.privateID}/players`);
		onValue(rtdbRef, async (snap) => {
			const { gameState } = this.getState();
			const data = snap.val();
			const val = Object.values(data);

			if (val[7] === true && val[2] === true) {
				gameState.oReady = val[7];
				gameState.gReady = val[2];
				this.saveState({ gameState });
				await path();
			}
		});
	},
	//Function checked
	async setMove(move) {
		const { userData } = this.getState();
		const response = await fetch(`${_API}/room/${userData.privateID}/move`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userData, move }),
		});
		const dt = await response.json();
		if (response.ok) {
			return dt.message;
		} else {
			return dt.message;
		}
	},
	//Function checked
	async watchMove() {
		const { userData, currentState } = await this.getState();
		const rtdbRef = await ref(db, `rooms/${userData.privateID}/players`);
		onValue(rtdbRef, async (snap) => {
			const { oMove, gMove } = snap.val();
			currentState.ownerMove = oMove;
			currentState.guestMove = gMove;

			await this.saveState({ currentState });
			console.log(currentState.ownerMove);
			console.log(currentState.guestMove);

			console.log('Vengo del WatchMove', await currentState);
		});
	},
	//Function checked
	async setWinner(ownerMove: Play, guestMove: Play, path) {
		const { currentState } = await this.getState();
		let winningMove = [
			{ win: 'rock', lose: 'scissors' },
			{ win: 'paper', lose: 'rock' },
			{ win: 'scissors', lose: 'paper' },
		];
		for (const m of winningMove) {
			if (m.win === ownerMove && m.lose === guestMove) {
				currentState.winner = currentState.owner;
				currentState.ownerScore = +1;
			} else if (m.win === guestMove && m.lose === ownerMove) {
				currentState.winner = currentState.guest;
				currentState.guestScore = +1;
			} else if (ownerMove === '') {
				currentState.winner = currentState.guest;
				currentState.guestScore = +1;
			} else if (guestMove === '') {
				currentState.winner = currentState.owner;
				currentState.ownerScore = +1;
			} else if (ownerMove === guestMove) {
				currentState.winner = 'Empate';
			}

			this.saveState({ currentState });
		}
		path();
	},
	//Function checked
	async saveScoreboard() {
		const { currentState, userData } = this.getState();
		const response = await fetch(
			`${_API}/${userData.privateID}/save-scoreboard`,
			{
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currentState, userData }),
			}
		);

		const dt = await response.json();
		if (response.ok) {
			return dt.message;
		}
	},
	//Function checked
	async playAgain() {
		const { userData } = this.getState();
		const response = await fetch(`${_API}/${userData.privateID}/set-online`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userData }),
		});

		const dt = await response.json();
		if (response.ok) {
			return dt.message;
		}
	},
	//Function checked
	async watchOnline(path) {
		const { userData } = await this.getState();
		const rtdbRef = await ref(db, `rooms/${userData.privateID}/players`);
		onValue(rtdbRef, async (snap) => {
			const { oOnline, gOnline } = await snap.val();
			if (oOnline && gOnline) {
				path();
			}
		});
	},
	//Function checked
	async deleteRoom(roomID, usrID) {
		const response = await fetch(
			`${_API}/delete-room/?roomID=${roomID}&usrID=${usrID}`,
			{ method: 'DELETE' }
		);
		const dt = await response.json();
		if (response.ok) {
			return true;
		} else {
			return false;
		}
	},

	getState() {
		return this.data;
	},
};

export { state };
