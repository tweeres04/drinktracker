import React from 'react';
import _orderBy from 'lodash/fp/orderBy';
import _round from 'lodash/round';
import dateFormat from 'date-fns/format';
import minDate from 'date-fns/min';
import maxDate from 'date-fns/max';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import classnames from 'classnames';

import { Section } from '../App';

function Statistic({ label, value, className, size = 1 }) {
	const valueClasses = classnames(`is-size-${size}`, className);
	return (
		<div className="column">
			<div className="is-size-7">{label}</div>
			<div className={valueClasses}>{value}</div>
		</div>
	);
}

export default function Drinks({ drinks, removeDrink, currentDrinks }) {
	drinks = _orderBy('time')('desc')(drinks);
	const drinkListItems = drinks.map((drink, i) => {
		const { value } = drink;
		let { time } = drink;
		time = dateFormat(time, 'h:mm a');
		return (
			<Section key={i}>
				<li style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ flex: 1, textAlign: 'left' }}>
						<label className="label is-marginless">
							{value} drink{value == 1 ? '' : 's'} at
						</label>
						<div className="is-size-3">{time}</div>
					</div>
					<div>
						<button
							className="button"
							onClick={() => {
								removeDrink(drink);
							}}
						>
							🗑
						</button>
					</div>
				</li>
			</Section>
		);
	});
	const drinkCount = drinks.reduce((total, { value }) => (total += value), 0);
	const times = drinks.map(d => d.time);

	const earliestDate = drinks.length ? minDate(times) : new Date();
	const latestDate = drinks.length ? maxDate(times) : null;
	const totalHours =
		differenceInMinutes(
			currentDrinks > 0 ? new Date() : latestDate,
			earliestDate
		) / 60;
	const drinksPerHour =
		drinkCount == 0
			? 0
			: totalHours == 0
			? '∞'
			: (drinkCount / totalHours).toFixed(2);

	const timeSinceLastDrink = latestDate
		? formatDistanceToNow(latestDate, {
				addSuffix: true
		  })
		: 'N/A';

	return (
		<div className="has-text-centered" data-tour="stats">
			<div className="columns is-centered is-mobile">
				<Statistic value={_round(drinkCount, 2)} label="Drinks" />
				<Statistic
					value={drinksPerHour}
					label="Drinks per hour"
					className={
						drinksPerHour < 2 && drinksPerHour > 0 ? 'has-text-success' : ''
					}
				/>
			</div>
			<div className="columns is-centered is-mobile">
				<Statistic
					value={timeSinceLastDrink}
					label="Last drink"
					className={
						latestDate && differenceInMinutes(new Date(), latestDate) >= 15
							? 'has-text-success'
							: ''
					}
					size={3}
				/>
			</div>
			<ul>{drinkListItems}</ul>
		</div>
	);
}
