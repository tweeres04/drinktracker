import React from 'react';
import _orderBy from 'lodash/fp/orderBy';

import { Section } from '../App';

export default function Drinks({ drinks }) {
	drinks = _orderBy('time')('desc')(drinks);
	const drinkListItems = drinks.map(({ value, time }, i) => {
		return (
			<Section key={i}>
				<li>
					<label className="label is-marginless">
						{value} drink{value == 1 ? '' : 's'} at
					</label>
					<div className="is-size-3">{time}</div>
				</li>
			</Section>
		);
	});
	const drinkCount = drinks.length;
	return (
		<div className="drink-list has-text-centered">
			<h3 className="title">
				{drinkCount} Drink{drinkCount == 1 ? '' : 's'}
			</h3>
			<ul>{drinkListItems}</ul>
		</div>
	);
}
