import { initAuth } from './pages/auth/auth';
import { initGame } from './pages/game/game';
import { initHome } from './pages/home/home';
import { initInstructions } from './pages/instructions/instructions';
import { initResult } from './pages/result/result';
import { initNewRoom } from './pages/roomID/roomID';

const ROUTES = [
	{
		path: /\/auth/,
		handler: initAuth,
	},
	{
		path: /\/home/,
		handler: initHome,
	},
	{
		path: /\/new-room/,
		handler: initNewRoom,
	},
	{
		path: /\/instructions/,
		handler: initInstructions,
	},
	{
		path: /\/game/,
		handler: initGame,
	},
	{
		path: /\/results/,
		handler: initResult,
	},
];

export function initRoute(root: Element) {
	function goTo(path) {
		history.pushState({}, '', path);
		window.onpopstate = () => {
			handlerRoute(location.pathname);
		};
		handlerRoute(path);
	}

	function handlerRoute(route) {
		for (const r of ROUTES) {
			if (r.path.test(route)) {
				const el = r.handler({ goTo: goTo }) as any;
				if (root.firstChild) {
					root.firstChild.remove();
				}
				root.append(el);
			}
		}
	}

	if (location.pathname === '/') {
		goTo('/auth');
	} else {
		handlerRoute(location.pathname);
	}
}
