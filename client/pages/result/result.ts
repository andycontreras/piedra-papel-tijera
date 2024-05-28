import { state } from '../../state';

export function initResult(params) {
	let div = document.createElement('div');
	let style = document.createElement('style');
	const { currentState, userData } = state.getState();
	console.log('currentState del result: ', currentState);

	style.innerHTML = `
    .home-container-result{
        height: 100vh;
        display:flex;
        flex-direction: column;
        overflow-y: hidden;
        align-items:center;
    }

    .hands-container{
        display: flex;
        justify-content: center;
        position: fixed;
        bottom: -4vh;
    }
    
    .hands-container-opponent{
        display: flex;
        justify-content: center;
        transform: rotate(180deg);
        position: fixed;
        top: -4vh;
    }
    @media(max-width:600px){
        .hands-container-opponent{
            top: -18vh;
        }
    }
    
    header{
        display: flex;
        align-items:center;
        justify-content:space-around;
        width:100%;
        height: 25%;
    }
    
    .room-id-box, .users-score{
        width: 30vh;
        font-weight: 700;
        padding: 2vh 0;
    }

    .sets{
        display: flex;
        justify-content: space-between;
        align-items: center; 
        width: 75%;
        height: 50%;
    }
    @media(max-width:600px){
        .sets{
            display: grid;
            justify-items: center;
            justify-content:center;
        }
    }

    .bttn{
        border: solid 3px #262524;
        border-radius: 12px;
        padding: 15px 10px;
        font-size: 1.3rem;
        width: 40vh;
        background-color: #223240;
        color: #D9CBBA;
    }
    .bttn:hover{
        background-color: #75B2BF;
        color: #262524;
        transition-duration: 500ms;
    }
    @media(max-width:600px){
        .bttn{
            width: 30vh;
        }
    }
    
    .winner{
        font-size: 4.5rem;
        font-family: "Lilita One", sans-serif;
        color: #d9a13b;
        text-shadow: #000000 3px 2px 11px;
        text-align: center;
        margin: 20px;
        transition: 500ms;
    }
    .winner:hover{
        color: #3B8C66;
        font-size: 5rem;
        transition-duration: 500ms;
    }
    @media(max-width:600px){
        .winner{
            font-size: 4rem;
        }
    }

    .wait-online{
        display: none;
        padding: 3vh;
        width: 30%;
        text-align: center;
        border-radius: 20px;
        backdrop-filter: blur(20px);
        box-shadow: 1px 1px 5px #262524;
    }`;

	div.innerHTML = `
    <div class="home-container-result">
        <header>
            <div class="users-score">
                <cus-text variant="header_text first-position">  ${currentState.owner}: ${currentState.ownerScore} </cus-text>
                <cus-text variant="header_text second-position"> ${currentState.guest}: ${currentState.guestScore} </cus-text>
            </div>
            <div class="room-id-box">
                <cus-text variant="header_text sala"> Sala </cus-text>
                <cus-text variant="header_text sala_id"> ${userData.publicID} </cus-text>
            </div>
        </header>
        <div class="sets">
            <button class="bttn try-again"> Jugar de nuevo </button>
            <text class="winner"> Ganó </br> ${currentState.winner} </text>
            <button class="bttn come-back"> volver al inicio </button>
        </div>
        <div class="hands-container-opponent">
            <cus-hands class="guest-paper" hand="paper"></cus-hands>
            <cus-hands class="guest-rock" hand="rock"></cus-hands>
            <cus-hands class="guest-scissors" hand="scissors"></cus-hands>
        </div>
        <div class="hands-container">
            <cus-hands class="paper" hand="paper"></cus-hands>
            <cus-hands class="rock" hand="rock"></cus-hands>
            <cus-hands class="scissors" hand="scissors"></cus-hands>
        </div>
        <div class="wait-online">
            <cus-text class="steps-dscrpt" variant="steps-dcrpt"> Esprando que tu contrincante presione ¡Volver a jugar! </cus-text>
        </div>
    </div>
    `;

	const tryAg = div.querySelector('.try-again');
	const comeBa = div.querySelector('.come-back');

	tryAg.addEventListener('click', (e) => {
		e.preventDefault();
		const wfo = div.querySelector('.wait-online') as HTMLElement;
		const rid = div.querySelector('.sets') as HTMLElement;
		rid.style.display = 'none';
		wfo.style.display = 'block';
		(async () => {
			await state.playAgain();
			await state.watchOnline(() => {
				params.goTo('/instructions');
			});
		})();
	});

	comeBa.addEventListener('click', async (e) => {
		e.preventDefault();
		if (userData.usrName === currentState.owner) {
			await state.deleteRoom(userData.privateID, userData.usrID);
			params.goTo('/home');
		} else {
			params.goTo('/home');
		}
	});

	const hands = {
		owner: {
			paper: div.querySelector('.paper') as HTMLElement,
			rock: div.querySelector('.rock') as HTMLElement,
			scissors: div.querySelector('.scissors') as HTMLElement,
		},
		guest: {
			paper: div.querySelector('.guest-paper') as HTMLElement,
			rock: div.querySelector('.guest-rock') as HTMLElement,
			scissors: div.querySelector('.guest-scissors') as HTMLElement,
		},
	};
	((move, hand) => {
		for (const [key, h] of Object.entries(hand)) {
			h.style.display = key === move ? 'block' : 'none';
		}
	})(currentState.guestMove, hands.guest);
	((move, hand) => {
		for (const [key, h] of Object.entries(hand)) {
			h.style.display = key === move ? 'block' : 'none';
		}
	})(currentState.ownerMove, hands.owner);

	div.append(style);
	return div;
}
