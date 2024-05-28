import { state } from '../../state';

export function initHome(params) {
	let div = document.createElement('div');
	let style = document.createElement('style');
	const { userData } = state.getState();
	style.innerHTML = `
    .buttons{
        gap: 4vh;
        justify-content: center;
    }

    .hands-container{
        display: flex;
        justify-content: center;
        position: relative;
        top: 4vh;
    }
    .sgnp{
        top: 20%;
        left: 36%;
        width: 100%;
        position: fixed;
        display: none;
    }
    @media(max-width: 600px){
        .sgnp{
            top:30%;
            left:15%;
            }
    }

    .buttons{
        display: grid; 
    }
    .code-index{
        display: none;
    }
    
    .code-index{
        gap: 1vh;
        justify-content: center;
        justify-items: center;
    }

    .sgnpHide{
        font-size: 3vh;
        font-weight: bold;
        color: #262524;
        justify-self: end;
        transition: 500ms;
    }
    .sgnpHide:hover{
        font-size: 3.5vh;
        cursor: pointer;
        transition-duration: 500ms;
    }

    .code_number{
        width: 74%;
        border: solid 1px #262524;
        height: 7vh;
        font-size: 0.9rem;
        border-radius: 15px;
        background: #000;
        padding: 0vh 2vh;
        color: #d9cbba;
    }
    @media(max-width:600px){
        .code_number{
            width:65%;
        }
    }

    .get_room{
        border: solid 3px #262524;
        border-radius: 12px;
        padding: 10px 10px;
        font-size: 1.2rem;
        width: 50vh;
        background-color: #223240;
        color: #D9CBBA;
        }
        .get_room:hover{
            background-color: #75B2BF;
            color: #262524;
            transition-duration: 500ms;
        }
        @media(max-width:600px){
            .get_room{
                width: 30vh;
            }
        }
    }
    `;

	div.innerHTML = `
    <div class="home-container">
        <cus-signup class="sgnp"></cus-signup>
        <cus-text variant="title"> Piedra, Papel o Tijera </cus-text>
        <cus-text variant="text"> Hola ${userData.usrName} </cus-text>
        <div class="buttons">
            <cus-button class="new_game">Nuevo Juego</cus-button>
            <cus-button class="join_room">Ingresar a una sala</cus-button>
        </div>
        <form class="code-index">
            <p class="sgnpHide">volver</p>
            <cus-text variant="steps-dcrpt"> Ingresa el código </cus-text>
            <input type="text" class="code_number roomID__code_number" name="code" placeholder="código">
            <input class="get_room" type="submit" value="Ingresa a la sala">
        </form>
        <div class="hands-container">
            <cus-hands hand="paper"></cus-hands>
            <cus-hands hand="rock"></cus-hands>
            <cus-hands hand="scissors"></cus-hands>
        </div>
    </div>
    `;

	let nwg = div.querySelector('.new_game');
	let jnr = div.querySelector('.join_room');
	console.log(userData.usrID);

	nwg.addEventListener('click', (e) => {
		e.preventDefault();
		const usrID = userData.usrID;
		(async () => {
			if (await state.createRoom(usrID)) {
				params.goTo('/new-room');
			}
		})();
	});

	const iCode: any = div.querySelector('.code-index');
	const buttons: any = div.querySelector('.buttons');
	jnr.addEventListener('click', (e) => {
		e.preventDefault();

		buttons.style.display = 'none';
		iCode.style.display = 'grid';
	});

	const submitRoom: any = div.querySelector(`.roomID__code_number[name=code]`);
	const subForm = div.querySelector('.code-index');
	subForm.addEventListener('submit', (e) => {
		e.preventDefault();
		let puID = submitRoom.value;
		const name = userData.usrName;
		(async () => {
			if (await state.joinRoom(puID, name)) {
				params.goTo('/instructions');
			}
		})();
	});

	const goBack: any = div.querySelector('.sgnpHide');
	goBack.addEventListener('click', (e) => {
		e.preventDefault();
		buttons.style.display = 'grid';
		iCode.style.display = 'none';
	});

	div.append(style);
	return div;
}
