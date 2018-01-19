import React from 'react';

import currentDrinks from '../currentDrinks';

export default function CurrentDrinks({ drinks, now }) {
	const currentDrinksValue = currentDrinks({ drinks, now });
	return (
		<section
			className={`hero${
				currentDrinksValue >= 10 ? ' is-danger' : ' is-primary'
			}`}
		>
			<div className="hero-body">
				<div className="container has-text-centered">
					<h1 className="title">{currentDrinksValue.toFixed(2)}</h1>
					<h2 className="subtitle">
						drink{currentDrinksValue == 1 ? '' : 's'} in your system
					</h2>
				</div>
			</div>
		</section>
	);
}
