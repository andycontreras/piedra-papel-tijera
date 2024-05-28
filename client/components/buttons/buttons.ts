customElements.define(
	'cus-button',
	class initButton extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: 'open' });
			const button = document.createElement('button');
			const style = document.createElement('style');

			button.className = 'main-button';
			style.innerHTML = `
            .main-button{
                border: solid 3px #262524;
                border-radius: 12px;
                padding: 15px 10px;
                font-size: 1.5rem;
                width: 60vh;
                background-color: #223240;
                color: #D9CBBA;
            }:hover{
                background-color: #75B2BF;
                color: #262524;
                transition-duration: 500ms;
            }
            @media(max-width:600px){
                .main-button{
                    width: 30vh;
                    font-size: 1.1rem;
                }
            }`;

			button.textContent = this.textContent;
			shadow.append(button);
			shadow.append(style);
		}
	}
);
