import React, { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import { get, set } from 'idb-keyval';

import { useDeferredInstallPrompt } from '../installableApp';

import iosActionImg from '../ios_action.png';

export default function Tour() {
	const [deferredInstallPrompt] = useDeferredInstallPrompt();
	const [seenHelp, setSeenHelp] = useState(true);

	useEffect(() => {
		async function getSeenHelpFromStorage() {
			const seenHelp = await get('seenHelp');
			if (!seenHelp) {
				setSeenHelp(seenHelp);
				set('seenHelp', true);
			}
		}
		getSeenHelpFromStorage();
	}, []);
	const steps = [
		{
			target: '[data-tour=add-drink]',
			content: 'Try adding a drink!'
		},
		{
			target: '[data-tour=current-drinks]',
			content:
				'The number of drinks in your system. It goes down as your body processes alcohol (1 standard drink per hour) and goes up when you log drinks.'
		},
		{
			target: '[data-tour=stats]',
			content: 'Here are a few extra stats to help keep on top of things!',
			placement: 'top'
		},
		{
			target: deferredInstallPrompt ? '[data-tour=install]' : '.field',
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

	return seenHelp ? null : (
		<Joyride
			steps={steps}
			styles={{ options: { primaryColor: 'hsl(204, 71%, 53%)' } }}
		/>
	);
}
