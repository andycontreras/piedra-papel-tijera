import { state } from '../../state';

export function initNewRoom(params) {
	let div = document.createElement('div');
	let style = document.createElement('style');
	const { userData } = state.getState();
	(async () => {
		await state.waitOpponent(() => {
			params.goTo('/instructions');
		});
	})();
	style.innerHTML = `
    .hands-container{
        display: flex;
        justify-content: center;
        position: relative;
        top: 4vh;
    }
    
    .text-container{
        width: 70%;
        text-align: center;
    }

    header{
        display: flex;
        align-items:center;
        justify-content:space-around;
        width:97%;
        height:20vh;
    }

    .roon-id-box, .users-score{
        width: 20vh;
        font-weight: 700;
    }
    `;

	div.innerHTML = `
    <div class="home-container">
        <header>
        <cus-text variant="title"> Bienvenido ${userData.usrName} </cus-text>
        </header>
        <div class="text-container">
            <cus-text variant="steps-dcrpt"> Compartí este código con tu contrincante y esperá a que se una a la sala </cus-text>
            <cus-text variant="title"> ${userData.publicID} </cus-text>
        </div>
        <div class="hands-container">
            <cus-hands hand="paper"></cus-hands>
            <cus-hands hand="rock"></cus-hands>
            <cus-hands hand="scissors"></cus-hands>
        </div>
    </div>
    `;
	(async () => {})();
	div.append(style);
	return div;
}
