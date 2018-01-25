import React from 'react';
import _orderBy from 'lodash/fp/orderBy';
import _round from 'lodash/round';
import dateFormat from 'date-fns/format';
import Tappable from 'react-tappable/lib/Tappable';
import minDate from 'date-fns/min';
import maxDate from 'date-fns/max';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

import { Section } from '../App';

function Statistic({ label, value, size = 1 }) {
	return (
		<div className="column">
			<div className="is-size-7">{label}</div>
			<div className={`is-size-${size}`}>{value}</div>
		</div>
	);
}

export default function Drinks({ drinks, removeDrink, currentDrinks }) {
	drinks = _orderBy('time')('desc')(drinks);
	const drinkListItems = drinks.map((drink, i) => {
		const { value } = drink;
		let { time } = drink;
		time = dateFormat(time, 'h:mm A');
		return (
			<Section key={i}>
				<Tappable
					component="div"
					onPress={() => {
						removeDrink(drink);
					}}
				>
					<li>
						<label className="label is-marginless">
							{value} drink{value == 1 ? '' : 's'} at
						</label>
						<div className="is-size-3">{time}</div>
					</li>
				</Tappable>
			</Section>
		);
	});
	const drinkCount = drinks.reduce((total, { value }) => (total += value), 0);
	const times = drinks.map(d => d.time);

	const earliestDate = drinks.length ? minDate(...times) : new Date();
	const latestDate = drinks.length ? maxDate(...times) : null;
	const totalHours =
		differenceInMinutes(
			currentDrinks > 0 ? new Date() : latestDate,
			earliestDate
		) / 60;
	const drinksPerHour =
		drinkCount == 0
			? 0
			: totalHours == 0 ? '∞' : (drinkCount / totalHours).toFixed(2);

	const timeSinceLastDrink = latestDate
		? distanceInWordsToNow(latestDate, {
				addSuffix: true
			})
		: 'N/A';

	return (
		<div className="has-text-centered">
			<div className="columns is-centered is-mobile">
				<Statistic value={_round(drinkCount, 2)} label="Drinks" />
				<Statistic value={drinksPerHour} label="Drinks per hour" />
			</div>
			<div className="columns is-centered is-mobile">
				<Statistic
					value={timeSinceLastDrink}
					label="Last drink"
					size={3}
				/>
			</div>
			<ul>{drinkListItems}</ul>
		</div>
	);
}
