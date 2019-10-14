export default function installableApp() {
	window.deferredInstallPrompt = new Promise(resolve => {
		window.addEventListener('beforeinstallprompt', e => {
			e.preventDefault();
			resolve(e);
			window.ga('send', 'event', 'App install', 'App can be installed');
		});
	});

	window.addEventListener('appinstalled', () => {
		window.ga('send', 'event', 'App install', 'App installed');
	});

	if (
		window.matchMedia('(display-mode: standalone)').matches ||
		window.navigator.standalone === true
	) {
		window.ga('send', 'event', 'App install', 'App launched in standalone');
	}
}
