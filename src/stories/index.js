import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import DrinkCalculator, {
	Modal as DrinkCalculatorModal
} from '../components/DrinkCalculator';

storiesOf('Welcome', module).add('to Storybook', () => (
	<Welcome showApp={linkTo('Button')} />
));

storiesOf('Button', module)
	.add('with text', () => (
		<Button onClick={action('clicked')}>Hello Button</Button>
	))
	.add('with some emoji', () => (
		<Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
	));

storiesOf('drinkCalculator', module)
	.add('modal', () => (
		<DrinkCalculatorModal
			save={drinks => {
				console.log(drinks);
			}}
			show={true}
		/>
	))
	.add('main', () => <DrinkCalculator />);
