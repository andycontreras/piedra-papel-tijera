const hands = {
	rock: require('url:../../img/rock.png'),
	paper: require('url:../../img/paper.png'),
	scissors: require('url:../../img/scissors.png'),
};

customElements.define(
	'cus-hands',
	class initHands extends HTMLElement {
		constructor() {
			super();
			this.render();
		}
		render() {
			const shadow = this.attachShadow({ mode: 'open' });
			const hand = this.getAttribute('hand');
			const div = document.createElement('div');
			const style = document.createElement('style');

			style.innerHTML = `
            .hnd-view{
                width: 20vh;
                height: 40vh;
                padding: 0 25px;
                opacity:0.7;
				cursor: pointer;
            }:hover{
                opacity:1;
                transition-duration: 500ms;
            }
            @media(max-width:600px){
                .hnd-view{
                    width: 12vh;
                    height: 27vh;
                    padding: 0 5px;
                }
            }`;

			div.innerHTML = `
            <img class="hands hnd-view" src="${hands[hand]}"/>
            `;

			shadow.appendChild(div);
			shadow.appendChild(style);
		}
	}
);
