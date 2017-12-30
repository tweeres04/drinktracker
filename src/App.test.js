import React from 'react';
import ReactDOM from 'react-dom';
import subMinutes from 'date-fns/sub_minutes';
import dateFormat from 'date-fns/format';

import App, { drinkFactory, currentDrinks } from './App';

test('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
});

test('creates a proper drinkFactory', () => {});

test.only('gives the right number of current drinks', () => {
	const format = 'HH:mm';
	const nowDate = new Date();

	const threeHoursAgo = dateFormat(subMinutes(nowDate, 240), format);
	const twoHoursAgo = dateFormat(subMinutes(nowDate, 120), format);
	const fiftyFiveMinutesAgo = dateFormat(subMinutes(nowDate, 55), format);
	const fortyFiveMinutesAgo = dateFormat(subMinutes(nowDate, 45), format);
	const thirtyMinutesAgo = dateFormat(subMinutes(nowDate, 30), format);
	const now = dateFormat(nowDate, format);

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
	const expected = 4.066;

	expect(actual).toBeCloseTo(expected);
});
