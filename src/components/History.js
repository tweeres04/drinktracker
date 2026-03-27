import React, { useState } from 'react';
import _orderBy from 'lodash/fp/orderBy';
import _round from 'lodash/round';
import dateFormat from 'date-fns/format';
import minDate from 'date-fns/min';
import maxDate from 'date-fns/max';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import startOfWeek from 'date-fns/startOfWeek';
import subWeeks from 'date-fns/subWeeks';
import isAfter from 'date-fns/isAfter';


import currentDrinks from '../currentDrinks';
import Nav from './Nav';
import { useSessions } from './Drinktracker';
import SessionSparkline from './SessionSparkline';

function peakDrinksInSession(drinks) {
	if (!drinks.length) return 0;

	let peak = 0;
	for (const t of drinks.map((d) => d.time)) {
		const drinksAtTime = drinks.filter((d) => d.time <= t);
		const value = currentDrinks({ drinks: drinksAtTime, now: t });
		if (value > peak) peak = value;
	}
	return peak;
}


function sessionDuration(drinks) {
	const times = drinks.map((d) => d.time);
	const mins = differenceInMinutes(maxDate(times), minDate(times));
	if (mins < 60) return `${mins}m`;
	const hours = Math.floor(mins / 60);
	const remainMins = mins % 60;
	return remainMins > 0 ? `${hours}h ${remainMins}m` : `${hours}h`;
}

function drinksPerWeek(sessions) {
	if (!sessions.length) return [];
	// Group sessions by week, show last 8 weeks
	const weeks = [];
	const now = new Date();
	for (let i = 0; i < 8; i++) {
		const weekStart = startOfWeek(subWeeks(now, i));
		const weekEnd = startOfWeek(subWeeks(now, i - 1));
		const weekSessions = sessions.filter((s) => {
			const sessionDate = minDate(s.drinks.map((d) => d.time));
			return isAfter(sessionDate, weekStart) && !isAfter(sessionDate, weekEnd);
		});
		const totalDrinks = weekSessions.reduce(
			(sum, s) => sum + s.drinks.reduce((t, d) => t + d.value, 0),
			0
		);
		weeks.push({
			label: dateFormat(weekStart, 'MMM d'),
			drinks: totalDrinks,
		});
	}
	return weeks;
}

function SessionDetail({ session }) {
	const drinks = _orderBy('time')('desc')(session.drinks);
	const drinkCount = drinks.reduce((t, d) => t + d.value, 0);

	return (
		<div style={{ padding: '0.5rem 0' }}>
			{drinks.map((drink, i) => (
				<div key={i} className="columns is-mobile is-marginless">
					<div className="column is-narrow">
						{dateFormat(drink.time, 'h:mm a')}
					</div>
					<div className="column">
						{drink.value} drink{drink.value === 1 ? '' : 's'}
					</div>
				</div>
			))}
			<div className="is-size-7 has-text-grey" style={{ marginTop: '0.25rem' }}>
				{_round(drinkCount, 1)} total drinks &middot;{' '}
				{sessionDuration(session.drinks)} &middot; Peak:{' '}
				{_round(peakDrinksInSession(session.drinks), 1)} in system
			</div>
		</div>
	);
}

export default function Sessions() {
	const { sessions } = useSessions();
	const [expandedId, setExpandedId] = useState(null);
	const [menu, setMenu] = useState(false);

	const sortedSessions = _orderBy((s) => minDate(s.drinks.map((d) => d.time)))(
		'desc'
	)(sessions);

	const allTimePeak = sessions.reduce((peak, s) => {
		const sessionPeak = peakDrinksInSession(s.drinks);
		return sessionPeak > peak ? sessionPeak : peak;
	}, 0);

	const totalDrinksAllTime = sessions.reduce(
		(sum, s) => sum + s.drinks.reduce((t, d) => t + d.value, 0),
		0
	);

	const avgDrinksPerSession =
		sessions.length > 0 ? totalDrinksAllTime / sessions.length : 0;

	const weeks = drinksPerWeek(sessions);

	return (
		<div>
			<Nav menu={menu} toggleMenu={() => setMenu(!menu)} colourClass="" />
			<section className="section">
				<div className="container">
					<h1 className="title">History</h1>

					{sessions.length === 0 ? (
						<p className="has-text-grey">
							No sessions yet. When you're done drinking, tap "New session" to
							save your session here.
						</p>
					) : (
						<>
							<div className="columns is-mobile has-text-centered">
								<div className="column">
									<div className="is-size-7">Sessions</div>
									<div className="is-size-3">{sessions.length}</div>
								</div>
								<div className="column">
									<div className="is-size-7">Total</div>
									<div className="is-size-3">
										{_round(totalDrinksAllTime, 1)}
									</div>
								</div>
								<div className="column">
									<div className="is-size-7">Avg/sess</div>
									<div className="is-size-3">
										{_round(avgDrinksPerSession, 1)}
									</div>
								</div>
								<div className="column">
									<div className="is-size-7">Peak</div>
									<div className="is-size-3">{_round(allTimePeak, 1)}</div>
								</div>
							</div>

							{weeks.some((w) => w.drinks > 0) && (
								<div style={{ marginBottom: '2rem' }}>
									<h2 className="subtitle is-6">Drinks per week</h2>
									{weeks.map((week) => (
										<div
											key={week.label}
											className="columns is-mobile is-marginless is-vcentered"
										>
											<div
												className="column is-narrow"
												style={{ width: '4.5rem' }}
											>
												<span className="is-size-7">{week.label}</span>
											</div>
											<div className="column">
												{week.drinks > 0 && (
													<div
														className="has-background-primary"
														style={{
															height: '1.25rem',
															borderRadius: '3px',
															width: `${Math.max(
																(week.drinks /
																	Math.max(...weeks.map((w) => w.drinks))) *
																	100,
																8
															)}%`,
														}}
													/>
												)}
											</div>
											<div
												className="column is-narrow"
												style={{ width: '2.5rem', textAlign: 'right' }}
											>
												<span className="is-size-7">
													{week.drinks > 0 ? _round(week.drinks, 1) : ''}
												</span>
											</div>
										</div>
									))}
								</div>
							)}

							<h2 className="subtitle is-6">All sessions</h2>
							{sortedSessions.map((session) => {
								const times = session.drinks.map((d) => d.time);
								const sessionDate = minDate(times);
								const drinkCount = session.drinks.reduce(
									(t, d) => t + d.value,
									0
								);
								const expanded = expandedId === session.id;

								return (
									<div
										key={session.id}
										className="box"
										style={{ cursor: 'pointer', padding: '1rem' }}
										onClick={() => setExpandedId(expanded ? null : session.id)}
									>
										<div className="columns is-mobile is-vcentered is-marginless">
											<div className="column">
												<strong>
													{dateFormat(sessionDate, 'EEE, MMM d, yyyy')}
												</strong>
											</div>
											<div className="column is-narrow has-text-right">
												{_round(drinkCount, 1)} drink
												{drinkCount === 1 ? '' : 's'}
											</div>
										</div>
										{expanded && (
											<>
												<SessionSparkline
													drinks={session.drinks}
													variant="dark"
												/>
												<SessionDetail session={session} />
											</>
										)}
									</div>
								);
							})}
						</>
					)}
				</div>
			</section>
		</div>
	);
}
