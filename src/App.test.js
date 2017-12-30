import React from 'react';
import ReactDOM from 'react-dom';
import subMinutes from 'date-fns/sub_minutes';

import App, { drinkFactory, currentDrinks } from './App';

test('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
});

test('creates a proper drinkFactory', () => {});

test.only('gives the right number of current drinks', () => {
	const nowDate = new Date();

	const threeHoursAgo = subMinutes(nowDate, 240);
	const twoHoursAgo = subMinutes(nowDate, 120);
	const fiftyFiveMinutesAgo = subMinutes(nowDate, 55);
	const fortyFiveMinutesAgo = subMinutes(nowDate, 45);
	const thirtyMinutesAgo = subMinutes(nowDate, 30);
	const now = nowDate;

	const drinks = [
		drinkFactory({
			time: threeHoursAgo,
			value: 1
		}),
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
			value: 2
		}),
		drinkFactory({
			time: now,
			value: 1
		})
	];

	const actual = currentDrinks({ drinks });
	const expected = 4.083;

	expect(actual).toBeCloseTo(expected);
});
