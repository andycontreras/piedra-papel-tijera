import { initRoute } from '../client/route';
import '../client/components/buttons/buttons';
import '../client/components/text/text';
import '../client/components/hands/hands';
import { state } from '../client/state';
(() => {
	const root: any = document.querySelector('.root');
	initRoute(root);
	state.init();
})();
