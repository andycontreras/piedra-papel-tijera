import { state } from '../../state';
export function initInstructions(params) {
	let div = document.createElement('div');
	let style = document.createElement('style');
	const { currentState, userData } = state.getState();

	style.innerHTML = `
    .hands-container{
        display: flex;
        justify-content: center;
        position: relative;
        top: 4vh;
    }

    
    header{
        display: flex;
        align-items:center;
        justify-content:space-around;
        width:100%;
        height:20vh;
    }
    
    .room-id-box, .users-score{
        width: 30vh;
        font-weight: 700;
        padding: 2vh 0;
    }
    
    .steps{
        display: block;
        padding: 3vh;
        width: 60%;
        text-align: center;
    }
    @media(max-width:600px){
        .steps{
            width:90%;
        }
    }
    
    .wait-ready{
        display: none;
        padding: 3vh;
        width: 30%;
        text-align: center;
        border-radius: 20px;
        backdrop-filter: blur(20px);
        box-shadow: 1px 1px 5px #262524;
    }
    @media(max-width:600px){
        .wait-ready{
            width:70%;
        }
    }
    `;

	div.innerHTML = `
    <div class="home-container">
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
        <div class="steps">
            <cus-text class="steps-dscrpt" variant="steps-dcrpt"> Presioná jugar y elegí: Piedra, papel o tijera antes que pasen los 3 segundos </cus-text>
            <cus-button class="play"> ¡Jugar! </cus-button>
        </div>
        <div class="wait-ready">
            <cus-text class="steps-dscrpt" variant="steps-dcrpt"> Esprando que tu contrincante presione ¡Jugar! </cus-text>
        </div>
        <div class="hands-container">
            <cus-hands hand="paper"></cus-hands>
            <cus-hands hand="rock"></cus-hands>
            <cus-hands hand="scissors"></cus-hands>
        </div>
    </div>
    `;
	const bttn: any = div.querySelector('.play');
	const popUp: any = div.querySelector('.wait-ready');
	const steps: any = div.querySelector('.steps');
	bttn.addEventListener('click', (e) => {
		e.preventDefault();
		steps.style.display = 'none';
		popUp.style.display = 'block';
		(async () => {
			if (await state.setReadyStatus()) {
				await state.watchReadyStatus(() => {
					params.goTo('/game');
				});
			}
		})();
		console.log(bttn);
		console.log(popUp);
		console.log(steps);
	});

	div.append(style);
	return div;
}
