import React from 'react';
import Joyride from 'react-joyride';
import { useDeferredInstallPrompt } from '../installableApp';

export default function Tour() {
	const [deferredInstallPrompt] = useDeferredInstallPrompt();
	const steps = [
		{
			target: 'button.button.is-fullwidth',
			content: 'Try adding a drink!'
		},
		{
			target: '.hero-body .title',
			content:
				'This is where the magic happens. This is the current number of drinks in your system. You can use this to track how drunk you are.'
		},
		{
			target: deferredInstallPrompt
				? '.button.is-inverted.is-rounded'
				: '.field',
			content: 'Add Drinktracker to your homescreen to access it any time!',
			styles: {
				options: { arrowColor: 'rgba(0,0,0,0)' }
			}
		}
	];

	const showTour = window.location.search.indexOf('tour') !== -1;
	return showTour ? (
		<Joyride
			steps={steps}
			styles={{ options: { primaryColor: 'hsl(204, 71%, 53%)' } }}
		/>
	) : null;
}
