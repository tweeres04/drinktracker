import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';

import DrinkAdder, { Modal as DrinkAdderModal } from '../components/DrinkAdder';

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

storiesOf('drinkAdder', module)
	.add('modal', () => (
		<DrinkAdderModal
			save={drinks => {
				console.log(drinks);
			}}
			show={true}
		/>
	))
	.add('main', () => <DrinkAdder />);
