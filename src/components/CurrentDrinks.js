import React from 'react';

export default function CurrentDrinks({ currentDrinks }) {
	return (
		<section
			className={`hero${
				currentDrinks >= 8
					? ' is-danger'
					: currentDrinks >= 6 ? ' is-warning' : ' is-primary'
			}`}
		>
			<div className="hero-body">
				<div className="container has-text-centered">
					<h1 className="title">{currentDrinks.toFixed(2)}</h1>
					<h2 className="subtitle">
						drink{currentDrinks == 1 ? '' : 's'} in your system
					</h2>
				</div>
			</div>
		</section>
	);
}
