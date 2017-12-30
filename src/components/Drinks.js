import React from 'react';
import _orderBy from 'lodash/fp/orderBy';
import dateFormat from 'date-fns/format';
import Tappable from 'react-tappable/lib/Tappable';

import { Section } from '../App';

export default function Drinks({ drinks, removeDrink }) {
	drinks = _orderBy('time')('desc')(drinks);
	const drinkListItems = drinks.map((drink, i) => {
		const { value } = drink;
		let { time } = drink;
		time = dateFormat(time, 'HH:mm');
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
	return (
		<div className="drink-list has-text-centered">
			<h3 className="title">
				{drinkCount} Drink{drinkCount == 1 ? '' : 's'}
			</h3>
			<ul>{drinkListItems}</ul>
		</div>
	);
}
