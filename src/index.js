import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import installableApp from './installableApp';
import * as FS from '@fullstory/browser';
import { initAnalytics, track, identify, registerSuperProperties } from './analytics';

installableApp();

if (process.env.NODE_ENV === 'production') {
	FS.init({
		orgId: process.env.REACT_APP_FULLSTORY_ID,
	});
}

// From https://web.dev/customize-install/#detect-launch-type
function getPWADisplayMode() {
	const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
	if (document.referrer.startsWith('android-app://')) {
		return 'twa';
	} else if (navigator.standalone || isStandalone) {
		return 'standalone';
	}
	return 'browser';
}

function analyticsSetup() {
	initAnalytics();

	window.addEventListener('appinstalled', () => {
		track('app_installed');
	});

	const displayMode = getPWADisplayMode();
	identify('display_mode', displayMode);
	registerSuperProperties({ display_mode: displayMode });
}

analyticsSetup();

window.addEventListener(
	'error',
	({ message, filename, lineno, colno, error }) => {
		message = [
			`Message: ${message}`,
			`Filename: ${filename}`,
			`Line: ${lineno}`,
			`Column: ${colno}`,
			`Error object: ${JSON.stringify(error)}`,
		].join(' - ');

		window.gtag('event', 'exception', {
			description: message,
		});
		console.error(error);
	}
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
