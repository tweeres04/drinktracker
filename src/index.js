import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

window.addEventListener('beforeinstallprompt', e => {
	window.deferredInstallPrompt = e;
});

window.addEventListener('appinstalled', () => {
	console.log('app installed');
});

if (window.matchMedia('(display-mode: standalone)').matches) {
	console.log('display-mode is standalone');
}

if (window.navigator.standalone === true) {
	console.log('display-mode is standalone');
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
