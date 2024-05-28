customElements.define(
	'cus-text',
	class initText extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: 'open' });
			const variant = this.getAttribute('variant');
			const text = document.createElement('p');
			const style = document.createElement('style');

			style.innerHTML = `
            .header_text{
                color: #D9A13B;
                margin: 10px 0px;
                font-size: 1.5rem;
                text-align: center;
                text-shadow: 2px 2px 3px #262524;
            }

            .steps-dcrpt{
                font-size: 2.3rem;
                color: #262524;
                text-shadow: #A6370F 2px 2px 3px;
                font-weight: 600;
                text-align: center;
                margin: 1vh;
            }
            @media(max-width:600px){
                .steps-dcrpt{
                    font-size: 1.8rem;
                    }
            }

            .text{
                font-size: 3.5rem;
                color: #A6370F;
                text-shadow: #262524 3px 3px 2px;
                margin: 1vh;
            }
            @media(max-width:600px){
                .text{
                    font-size: 3rem;
                    text-align: center;
                    }
            }

            .title{
                font-size: 4rem;
                font-family: "Lilita One", sans-serif;
                color: #60BF81;
                text-shadow: #262524 3px 3px 2px;
                text-align: center;
                margin: 20px;
                transition: 500ms;
            }
            @media(max-width:600px){
                .title{
                    font-size: 3rem;
                    }
            }
            .title:hover{
                color: #3B8C66;
                font-size: 4.3rem;
                transition-duration: 500ms;
            }`;
			text.className = variant;
			text.textContent = this.textContent;
			shadow.appendChild(text);
			shadow.appendChild(style);
		}
	}
);
