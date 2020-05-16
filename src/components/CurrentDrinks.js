import React from 'react';
import addMinutes from 'date-fns/addMinutes';
import formatDate from 'date-fns/format';
import classnames from 'classnames';

function SoberTime({ currentDrinks }) {
	const soberTime = addMinutes(new Date(), currentDrinks * 60);
	return (
		currentDrinks > 0 && (
			<div
				className="tags has-addons has-text-centered"
				style={{ justifyContent: 'center' }}
			>
				<div className="tag is-light">Sober</div>
				<div className="tag is-info">{formatDate(soberTime, 'h:mm a')}</div>
			</div>
		)
	);
}

export default function CurrentDrinks({ currentDrinks }) {
	const danger = currentDrinks >= 6;
	const warning = currentDrinks >= 4 && currentDrinks < 6;
	const messageClasses = classnames('message', {
		'is-warning': warning,
		'is-danger': danger,
	});
	return (
		<section
			className={`hero${
				danger ? ' is-danger' : warning ? ' is-warning' : ' is-primary'
			}`}
		>
			<div className="hero-body">
				<div className="container has-text-centered">
					<h1 className="title" data-tour="current-drinks">
						{currentDrinks.toFixed(2)}
					</h1>
					<h2 className="subtitle">
						drink
						{currentDrinks == 1 ? '' : 's'} in your system
					</h2>
					{(warning || danger) && (
						<div className={messageClasses}>
							<div className="message-body">
								{warning ? 'Try some water' : 'Home time'}
							</div>
						</div>
					)}
					<SoberTime currentDrinks={currentDrinks} />
				</div>
			</div>
		</section>
	);
}
