import { state } from '../../state';

export function initAuth(params) {
	let div = document.createElement('div');
	let style = document.createElement('style');

	style.innerHTML = `
    .botones{
        display: grid;
        gap: 5vh;
        justify-content: center;
    }

    .text{
        font-size: 1.3rem;
        margin-top: 1vh;
        padding: 0px;
        color: #400D09;
    }
    @media(max-width:600px){
        .text{
            font-size: 1rem
            margin-top: 0vh;
            }
    }

    .sgnpHide, .lgnHide{
        font-size: 3vh;
        font-weight: bold;
        color: #262524;
        justify-self: end;
        transition: 500ms;
    }
    .sgnpHide, .lgnHide:hover{
        font-size: 3vh;
        cursor: pointer;
        transition-duration: 500ms;
    }

    .npt{
        width: 90%;
        border: solid 1px #262524;
        height: 7vh;
        font-size: 0.9rem;
        border-radius: 15px;
        background: #000;
        padding: 0vh 2vh;
        color: #d9cbba;
    }
    @media(max-width:600px){
        .npt{
            width: 75%;
            }
    }

    .send{
        border: solid 3px #262524;
        border-radius: 12px;
        padding: 10px 10px;
        font-size: 1.2rem;
        width: 50vh;
        background-color: #223240;
        color: #D9CBBA;
    }::hover{
        background-color: #75B2BF;
        color: #262524;
        transition-duration: 500ms;
    }
    @media(max-width:600px){
        .send{
            width: 30vh;
            }
    }
    
    .hands-container{
        display: flex;
        justify-content: center;
        position: relative;
        top: 4vh;
    }
    .lgn-form{
        display: none;
    }
    .sgnp-form{
        display: none;
    }
    .sgnp-form, .lgn-form{
        gap: 1vh;
        justify-items: center;
    }
    @media(max-width: 600px){
        .sgnp, .lgn{
            top:30%;
            left:15%;
            }
        }
    `;

	div.innerHTML = `
    <div class="home-container">
        <cus-text variant="title"> Piedra, Papel o Tijera </cus-text>

        <div class="botones main">
            <cus-button class="log-in">Iniciar sesión</cus-button>
            <cus-button class="sign-up">Registrarme</cus-button>
        </div>

        <form class="lgn-form">
            <p class="lgnHide">volver</p>
            <label for="email" class="text"> Ingresa tu email </label>
            <input class="npt email__lgn-npt" type="email" name="email" placeholder="Ingresa tu email"/>
            <input class="send" type="submit" value="Ingresar">
        </form>

        <form class="sgnp-form">
            <p class="sgnpHide">volver</p>
            <label for="name" class="text" > Ingresa tu nombre </label>
            <input class="npt name__sgnp-npt" type="text" id="name" name="name" placeholder="Ingresa tu nombre" pattern="[A-Za-z0-9]{4,10}" title="De 4-10 caracteres, letras y numeros, sin espacios" required>
            
            <label for="email" class="text"> Ingresa tu email </label>
            <input class="npt email__sgnp-npt" type="email" id="email" name="email" placeholder="Ingresa tu email" required>
            
            <input class="send" type="submit" value="Enviar">
        </form>
        <div class="hands-container">
            <cus-hands hand="paper"></cus-hands>
            <cus-hands hand="rock"></cus-hands>
            <cus-hands hand="scissors"></cus-hands>
        </div>
    </div>
    `;
	//COMPORTAMIENTO DE LOS BOTONES:
	const bttnMain: any = div.querySelector('.main');
	const lgnBttn: any = div.querySelector('.log-in');
	const lgnForm: any = div.querySelector('.lgn-form');
	lgnBttn.addEventListener('click', (e) => {
		e.preventDefault();
		bttnMain.style.display = 'none';
		lgnForm.style.display = 'grid';
		console.log('Hice click en: ', lgnBttn);
	});

	const sgnpBttn: any = div.querySelector('.sign-up');
	const sgnpForm: any = div.querySelector('.sgnp-form');
	sgnpBttn.addEventListener('click', (e) => {
		e.preventDefault();
		bttnMain.style.display = 'none';
		sgnpForm.style.display = 'grid';
		console.log('Hice click en: ', sgnpBttn);
	});

	const lgnhidden: any = div.querySelector('.lgnHide');
	const sgnphidden: any = div.querySelector('.sgnpHide');
	lgnhidden.addEventListener('click', (e) => {
		e.preventDefault();
		bttnMain.style.display = 'grid';
		lgnForm.style.display = 'none';
		sgnpForm.style.display = 'none';
	});
	sgnphidden.addEventListener('click', (e) => {
		e.preventDefault();
		bttnMain.style.display = 'grid';
		lgnForm.style.display = 'none';
		sgnpForm.style.display = 'none';
	});

	//COMPORTAMIENTO DE LOGIN
	const lgnInput: any = div.querySelector('.email__lgn-npt[name="email"]');
	lgnForm.addEventListener('submit', (e) => {
		e.preventDefault();
		let email = lgnInput.value;
		console.log(email);
		//Ingresar acá la funcion del state para hacer login
		(async () => {
			if (await state.login(email)) {
				params.goTo('/home');
			}
		})();
	});

	//COMPORTAMIENTO DE SIGN UP
	const nameInput: any = div.querySelector('.name__sgnp-npt[name="name"]');
	const emailInput: any = div.querySelector('.email__sgnp-npt[name="email"]');
	sgnpForm.addEventListener('submit', (e) => {
		e.preventDefault();
		let name = nameInput.value;
		let email = emailInput.value;

		console.log(name);
		console.log(email);

		//Ingresar acá la funcion del state para hacer login
		(async () => {
			if (await state.signup(email, name)) {
				params.goTo('/home');
			}
		})();
	});

	div.append(style);
	return div;
}
