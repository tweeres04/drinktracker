import React from 'react';
import Joyride from 'react-joyride';
import { useDeferredInstallPrompt } from '../installableApp';

import iosActionImg from '../ios_action.png';

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
				'The number of drinks in your system. It goes down as your body processes alcohol (1 standard drink per hour) and goes up when you log drinks.'
		},
		{
			target: deferredInstallPrompt
				? '.button.is-inverted.is-rounded'
				: '.field',
			content: deferredInstallPrompt ? (
				"Install Drinktracker and it'll be easy to find when you need it!"
			) : (
				<div>
					<div style={{ marginBottom: '0.5rem' }}>
						<img src={iosActionImg} alt="iOS action" />
					</div>
					Add Drinktracker to your homescreen and it'll be easy to find when you
					need it!
				</div>
			),
			...(deferredInstallPrompt
				? {}
				: {
						styles: {
							options: { arrowColor: 'rgba(0,0,0,0)' }
						}
				  })
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
