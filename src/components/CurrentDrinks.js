import React from 'react';
import addHours from 'date-fns/add_hours';
import formatDate from 'date-fns/format';

function SoberTime({ currentDrinks }) {
	const soberTime = addHours(new Date(), currentDrinks);
	return (
		currentDrinks > 0 && (
			<div
				className="tags has-addons has-text-centered"
				style={{ justifyContent: 'center' }}
			>
				<div className="tag is-light">Sober</div>
				<div className="tag is-info">{formatDate(soberTime, 'h:mm A')}</div>
			</div>
		)
	);
}

export default function CurrentDrinks({ currentDrinks }) {
	return (
		<section
			className={`hero${
				currentDrinks >= 8
					? ' is-danger'
					: currentDrinks >= 6
						? ' is-warning'
						: ' is-primary'
			}`}
		>
			<div className="hero-body">
				<div className="container has-text-centered">
					<h1 className="title">{currentDrinks.toFixed(2)}</h1>
					<h2 className="subtitle">
						drink{currentDrinks == 1 ? '' : 's'} in your system
					</h2>
					<SoberTime currentDrinks={currentDrinks} />
				</div>
			</div>
		</section>
	);
}
