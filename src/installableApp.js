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
