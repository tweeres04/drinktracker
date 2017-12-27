import React from 'react';
import ReactDOM from 'react-dom';
import subMinutes from 'date-fns/sub_minutes';
import dateFormat from 'date-fns/format';

import App, { drinkFactory, currentDrinks } from './App';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
});

it('creates a proper drinkFactory', () => {});

it('gives the right number of current drinks', () => {
	const format = 'HH:mm';
	const nowDate = new Date();

	const twoHoursAgo = dateFormat(subMinutes(nowDate, 120), format);
	const fiftyFiveMinutesAgo = dateFormat(subMinutes(nowDate, 55), format);
	const fortyFiveMinutesAgo = dateFormat(subMinutes(nowDate, 45), format);
	const thirtyMinutesAgo = dateFormat(subMinutes(nowDate, 30), format);
	const now = dateFormat(nowDate, format);

	// console.log(now, thirtyMinutesAgo, fortyFiveMinutesAgo, twoHoursAgo);
	const drinks = [
		drinkFactory({
			time: twoHoursAgo,
			value: 1
		}),
		drinkFactory({
			time: fiftyFiveMinutesAgo,
			value: 1
		}),
		drinkFactory({
			time: fortyFiveMinutesAgo,
			value: 1
		}),
		drinkFactory({
			time: thirtyMinutesAgo,
			value: 1
		}),
		drinkFactory({
			time: now,
			value: 1
		})
	];

	expect(currentDrinks(drinks)).toBeCloseTo(1.83);
});
