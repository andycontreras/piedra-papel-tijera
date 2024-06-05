import { state } from '../../state';
export function initGame(params) {
	let div = document.createElement('div');
	let style = document.createElement('style');
	const { currentState, userData } = state.getState();
	let counter = 5;
	const countdown = setInterval(() => {
		counter--;
		const clock: any = div.querySelector('.countdown');
		clock.textContent = String(counter);
		if (counter <= 1) {
			clearInterval(countdown);
			setTimeout(() => {
				(async () => {
					await state.watchMove();
					await state.setWinner(
						currentState.ownerMove,
						currentState.guestMove,
						async () => {
							await state.saveScoreboard();
							params.goTo('/results');
						}
					);

					console.log(currentState);
				})();
			}, 2000);
		}
	}, 1000);

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
    
    .countdown{
        color: #D9A13B;
        margin: 10px 0px;
        font-size: 10rem;
        text-align: center;
        text-shadow: 2px 2px 5px #262524;
        padding:20px;
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
            <div class="countdown">${counter}</div>
        </div>
        <div class="hands-container">
            <cus-hands class="paper" hand="paper"></cus-hands>
            <cus-hands class="rock" hand="rock"></cus-hands>
            <cus-hands class="scissors" hand="scissors"></cus-hands>
        </div>
    </div>
    `;

	const paper: any = div.querySelector('.paper');
	const rock: any = div.querySelector('.rock');
	const scissors: any = div.querySelector('.scissors');

	function handlehand(selectHand: HTMLElement) {
		const hands = [paper, rock, scissors];
		hands.forEach((hand) => {
			if (hand !== selectHand) {
				hand.style.display = 'none';
			}
		});
		const hs = selectHand.getAttribute('hand');
		if (hs) {
			state.setMove(hs);
		}
	}
	paper.addEventListener('click', () => {
		handlehand(paper);
	});
	rock.addEventListener('click', () => {
		handlehand(rock);
	});
	scissors.addEventListener('click', () => {
		handlehand(scissors);
	});

	div.append(style);
	return div;
}
