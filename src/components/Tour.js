import React from 'react';
import Joyride from 'react-joyride';

const steps = [
	{
		target: 'button.button.is-fullwidth',
		content: 'Try adding a drink!'
	},
	{
		target: 'section.hero',
		content:
			'This is where the magic happens. This is the current number of drinks in your system.'
	},
	{
		target: '.field',
		content: 'Add Drinktracker to your homescreen to access it any time!',
		styles: {
			options: { arrowColor: 'rgba(0,0,0,0)' }
		}
	}
];

export default function Tour() {
	return (
		<Joyride steps={steps} styles={{ options: { primaryColor: '#00d1b2' } }} />
	);
}
