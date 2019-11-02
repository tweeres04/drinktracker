import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import installableApp from './installableApp';

installableApp();

window.addEventListener(
	'error',
	({ message, filename, lineno, colno, error }) => {
		message = [
			`Message: ${message}`,
			`Filename: ${filename}`,
			`Line: ${lineno}`,
			`Column: ${colno}`,
			`Error object: ${JSON.stringify(error)}`
		].join(' - ');

		window.gtag('event', 'exception', {
			description: message
		});
		console.error(error);
	}
);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
