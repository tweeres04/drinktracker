import React from 'react';
import _orderBy from 'lodash/fp/orderBy';
import dateFormat from 'date-fns/format';
import Tappable from 'react-tappable/lib/Tappable';
import minDate from 'date-fns/min';
import differenceInMinutes from 'date-fns/difference_in_minutes';

import { Section } from '../App';

function Statistic({ label, value }) {
	return (
		<div className="column">
			<div className="is-size-1">{value}</div>
			<div className="is-size-7">{label}</div>
		</div>
	);
}

export default function Drinks({ drinks, removeDrink }) {
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
	const totalHours = differenceInMinutes(new Date(), earliestDate) / 60;
	const drinksPerHour = totalHours == 0 ? 0 : drinkCount / totalHours;
	return (
		<div className="has-text-centered">
			<div className="columns is-centered is-mobile">
				<Statistic
					value={drinkCount}
					label={`Drink${drinkCount == 1 ? '' : 's'}`}
				/>
				<Statistic
					value={drinksPerHour.toFixed(2)}
					label="Drinks per hour"
				/>
			</div>
			<ul>{drinkListItems}</ul>
		</div>
	);
}
