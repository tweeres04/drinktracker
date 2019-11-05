import { useState, useEffect } from 'react';

export default function installableApp() {
	window.deferredInstallPrompt = new Promise(resolve => {
		window.addEventListener('beforeinstallprompt', e => {
			e.preventDefault();
			resolve(e);
			window.gtag('event', 'App can be installed', {
				event_category: 'App install'
			});
		});
	});

	window.addEventListener('appinstalled', () => {
		window.gtag('event', 'App installed', {
			event_category: 'App install'
		});
	});

	if (
		window.matchMedia('(display-mode: standalone)').matches ||
		window.navigator.standalone === true
	) {
		window.gtag('event', 'App launched in standalone', {
			event_category: 'App install'
		});
	}
}

export function useDeferredInstallPrompt() {
	const [deferredInstallPrompt, setDeferredInstallPrompt] = useState();
	useEffect(() => {
		if (window.deferredInstallPrompt) {
			window.deferredInstallPrompt.then(e => {
				setDeferredInstallPrompt(e);
			});
		}
	});
	return [deferredInstallPrompt, setDeferredInstallPrompt];
}
