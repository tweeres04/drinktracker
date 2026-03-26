import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { get, set } from 'idb-keyval';

import { useFloating, FloatingArrow, arrow } from '@floating-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import amplitude from 'amplitude-js';

import currentDrinks from '../currentDrinks';
import minDate from 'date-fns/min';
import addMinutes from 'date-fns/addMinutes';
import dateFormat from 'date-fns/format';

import IosShareIcon from './IosShareIcon';
import Nav from './Nav';
import CurrentDrinks from './CurrentDrinks';
import NewDrink from './NewDrink';
import DrinksList from './DrinksList';
import { useDeferredInstallPrompt } from '../installableApp';

import { drinkFactory } from './../App';

function useDrinks() {
	const [drinks, setDrinks] = useState();

	useEffect(() => {
		async function loadDrinks() {
			const drinks = (await get('drinks')) || [];
			setDrinks(drinks);
		}
		loadDrinks();
	}, []);

	function addDrink(drink) {
		setDrinks((prevDrinks) => {
			const drinks = prevDrinks.concat(drink).map(drinkFactory);
			set('drinks', drinks);
			return drinks;
		});
		amplitude.getInstance().logEvent('drink_added', drink);
		window.gtag('event', 'Drink added', {
			event_category: 'Drinks',
		});
	}
	function removeDrink(drink) {
		setDrinks((prevState) => {
			const drinks = prevState.filter((d) => d !== drink);
			set('drinks', drinks);
			return drinks;
		});
		amplitude.getInstance().logEvent('drink_removed');
		window.gtag('event', 'Drink removed', {
			event_category: 'Drinks',
		});
	}

	function clearDrinks() {
		set('drinks', []);
		setDrinks([]);
	}

	return {
		drinks,
		addDrink,
		removeDrink,
		clearDrinks,
	};
}

export function useSessions() {
	const [sessions, setSessions] = useState([]);

	useEffect(() => {
		async function loadSessions() {
			const sessions = (await get('sessions')) || [];
			setSessions(
				sessions.map((s) => ({
					...s,
					drinks: s.drinks.map(drinkFactory),
				}))
			);
		}
		loadSessions();
	}, []);

	function saveSession(drinks) {
		if (!drinks || drinks.length === 0) return;
		const session = {
			id: Date.now().toString(),
			drinks: drinks.map(drinkFactory),
		};
		setSessions((prev) => {
			const updated = [...prev, session];
			set('sessions', updated);
			return updated;
		});
		amplitude.getInstance().logEvent('new_session');
		window.gtag('event', 'New session', {
			event_category: 'Sessions',
		});
	}

	return { sessions, saveSession };
}

function InstallNotification({ deferredInstallPrompt }) {
	const [showInstallNotification, setShowInstallNotification] = useState(false);
	const [isIos, setIsIos] = useState(false);

	useEffect(() => {
		const isStandalone = window.matchMedia(
			'(display-mode: standalone)'
		).matches;
		setShowInstallNotification(!isStandalone);
	}, []);

	useEffect(() => {
		// From https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
		setIsIos(
			/Mobi/.test(window.navigator.userAgent) &&
				/AppleWebKit/.test(window.navigator.userAgent) &&
				!/Chrom/.test(window.navigator.userAgent)
		);
	}, []);

	return showInstallNotification ? (
		<div
			className={`notification is-primary`}
			style={{ position: 'fixed', bottom: 0, width: '100%', marginBottom: 0 }}
		>
			<button
				className="delete"
				onClick={() => {
					setShowInstallNotification(false);
				}}
			></button>
			<p className="has-text-centered">
				Install Drinktracker to your home screen for quick access
			</p>
			{deferredInstallPrompt ? (
				<div className="has-text-centered" style={{ marginTop: '0.5rem' }}>
					<button
						className={`button is-inverted is-primary`}
						onClick={async () => {
							deferredInstallPrompt.prompt();
							const choiceResult = await deferredInstallPrompt.userChoice;
							if (choiceResult.outcome === 'accepted') {
								amplitude.getInstance().logEvent('accepted_add_to_home_screen');
								window.gtag('event', 'Accepted add to home screen', {
									event_category: 'App install',
								});
							} else {
								amplitude
									.getInstance()
									.logEvent('dismissed_add_to_home_screen');
								window.gtag('event', 'Dismissed add to home screen', {
									event_category: 'App install',
								});
							}
						}}
					>
						Add to home screen
					</button>
				</div>
			) : isIos ? (
				<p className="has-text-centered mt-1">
					Tap the share button (with this icon: <IosShareIcon />
					), then tap "Add to Home Screen"
				</p>
			) : null}
		</div>
	) : null;
}

function CurrentDrinksExplainer({ anchor, drinks }) {
	const [show, setShow] = useState(false);
	const [isNewUser, setIsNewUser] = useState(false);
	const [step, setStep] = useState(1);
	const arrowRef = useRef(null);
	const { refs, floatingStyles, context } = useFloating({
		elements: { reference: anchor },
		middleware: [arrow({ element: arrowRef })],
	});

	useEffect(() => {
		async function loadIsNewUser() {
			const results = await Promise.all([
				get('drinkCalculatorState'),
				get('drinks'),
				get('newDrinkState'),
			]);
			const noResults = !results.some((r) => r);
			if (noResults) {
				setIsNewUser(true);
			}
		}
		loadIsNewUser();
	}, []);

	useEffect(() => {
		if (isNewUser && drinks?.length === 1) {
			setShow(true);
			anchor.scrollIntoView({ block: 'center' });
		}
	}, [anchor, drinks, isNewUser]);

	function stepForward() {
		if (step === 1) {
			setStep(2);
		} else if (step === 2) {
			setStep(3);
		} else if (step === 3) {
			setShow(false);
			setIsNewUser(false);
		} else {
			throw new Error(
				"CurrentDrinksExplainer - Tried to step forward to a step that doesn't exist"
			);
		}
	}

	return show ? (
		<div
			ref={refs.setFloating}
			style={{ ...floatingStyles, width: '75%', marginTop: '1rem' }}
			className="notification is-info is-light"
		>
			<button className="delete" onClick={stepForward}></button>
			<div className="content m-0">
				{step === 1 ? (
					<p>
						Nice! You added a drink! This is how many drinks are in your system
						now.
					</p>
				) : step === 2 ? (
					<p>
						This number goes down over time. Check back when you're thinking
						about having another drink.
					</p>
				) : step === 3 ? (
					<p>
						I recommend aiming to stay below 2.0 to start. Over time, you'll get
						a sense of what number works for you.
					</p>
				) : null}
				<div className="columns is-mobile">
					<div className="column is-flex is-align-items-center">{step}/3</div>
					<div className="column is-narrow">
						<button className="button is-info" onClick={stepForward}>
							{step === 3 ? 'Done' : 'Next'}
						</button>
					</div>
				</div>
			</div>
			<FloatingArrow
				ref={arrowRef}
				context={context}
				fill="#eff5fb" // bulma light info notification background
			/>
		</div>
	) : null;
}

function SessionSparkline({ drinks, now }) {
	const [selected, setSelected] = useState(null);
	const svgRef = useRef(null);

	useEffect(() => {
		if (selected === null) return;
		function handleOutsideClick(e) {
			if (svgRef.current && !svgRef.current.contains(e.target)) {
				setSelected(null);
			}
		}
		document.addEventListener('click', handleOutsideClick);
		return () => {
			document.removeEventListener('click', handleOutsideClick);
		};
	}, [selected]);

	if (!drinks || drinks.length === 0) return null;

	const times = drinks.map((d) => d.time);
	const start = minDate(times);
	const totalMinutes = (now - start) / 60000;
	if (totalMinutes <= 0) return null;

	// Sample every 2 minutes
	const steps = Math.max(Math.ceil(totalMinutes / 2), 2);
	const points = [];
	let maxVal = 0;
	for (let i = 0; i <= steps; i++) {
		const t = addMinutes(start, (totalMinutes * i) / steps);
		const val = currentDrinks({ drinks, now: t });
		if (val > maxVal) maxVal = val;
		points.push({ t, val });
	}

	if (maxVal === 0) return null;

	const width = 300;
	const chartHeight = 80;
	const labelHeight = 14;
	const height = chartHeight + labelHeight;
	const padding = 4;
	const dataWidth = width * (2 / 3);

	const xScale = (i) => padding + (i / steps) * (dataWidth - padding * 2);
	const yScale = (val) =>
		chartHeight - padding - (val / maxVal) * (chartHeight - padding * 2);

	const linePath = points
		.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(p.val)}`)
		.join(' ');

	const areaPath =
		linePath +
		` L${xScale(steps)},${yScale(0)} L${xScale(0)},${yScale(0)} Z`;

	// Hour marks along the bottom, snapped to clock hours
	const hourMarks = [];
	const firstHour = new Date(start);
	firstHour.setMinutes(0, 0, 0);
	if (firstHour < start) firstHour.setHours(firstHour.getHours() + 1);
	for (let t = new Date(firstHour); t <= now; t = new Date(t.getTime() + 3600000)) {
		const minuteOffset = (t - start) / 60000;
		const stepIndex = (minuteOffset / totalMinutes) * steps;
		const x = xScale(stepIndex);
		hourMarks.push({ x, label: dateFormat(t, 'h a') });
	}

	const lastPoint = points[points.length - 1];
	const dotX = xScale(steps);
	const dotY = yScale(lastPoint.val);

	function handleTap(e) {
		const svg = svgRef.current;
		if (!svg) return;
		const rect = svg.getBoundingClientRect();
		const clientX = e.touches ? e.touches[0].clientX : e.clientX;
		const svgX = ((clientX - rect.left) / rect.width) * width;

		// Find nearest point
		let nearest = 0;
		let nearestDist = Infinity;
		for (let i = 0; i <= steps; i++) {
			const dist = Math.abs(xScale(i) - svgX);
			if (dist < nearestDist) {
				nearestDist = dist;
				nearest = i;
			}
		}

		if (selected === nearest) {
			setSelected(null);
		} else {
			setSelected(nearest);
		}
	}

	const sel = selected !== null ? points[selected] : null;
	const selX = selected !== null ? xScale(selected) : 0;
	const selY = selected !== null ? yScale(sel.val) : 0;
	const tooltipWidth = 80;
	const tooltipHeight = 36;
	const tooltipX = Math.min(
		Math.max(selX - tooltipWidth / 2, 0),
		width - tooltipWidth
	);
	const tooltipAbove = selY - tooltipHeight - 8;
	const tooltipY = tooltipAbove >= 0 ? tooltipAbove : selY + 8;

	return (
		<div className="has-text-centered" style={{ marginTop: '1rem' }}>
			<svg
				ref={svgRef}
				viewBox={`0 0 ${width} ${height}`}
				style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
				onClick={handleTap}
			>
				<defs>
					<linearGradient id="sparklineGradient" x1="0" x2="0" y1="0" y2="1">
						<stop offset="0%" stopColor="white" stopOpacity="0.15" />
						<stop offset="100%" stopColor="white" stopOpacity="0" />
					</linearGradient>
				</defs>
				<path d={areaPath} fill="url(#sparklineGradient)" />
				<path
					d={linePath}
					fill="none"
					stroke="rgba(255, 255, 255, 0.5)"
					strokeWidth="2"
				/>
				{hourMarks.map((mark) => (
					<g key={mark.label}>
						<line
							x1={mark.x}
							y1={yScale(0)}
							x2={mark.x}
							y2={yScale(0) + 3}
							stroke="white"
							strokeWidth="1"
							opacity="0.3"
						/>
						<text
							x={mark.x}
							y={yScale(0) + labelHeight}
							textAnchor="middle"
							fill="white"
							fontSize="8"
							opacity="0.5"
						>
							{mark.label}
						</text>
					</g>
				))}
				<circle cx={dotX} cy={dotY} r="4" fill="white" />
				<circle cx={dotX} cy={dotY} r="8" fill="white" opacity="0.2" />
				{sel && (
					<>
						<line
							x1={selX}
							y1={selY}
							x2={selX}
							y2={yScale(0)}
							stroke="white"
							strokeWidth="1"
							opacity="0.3"
						/>
						<circle cx={selX} cy={selY} r="4" fill="white" />
						<rect
							x={tooltipX}
							y={tooltipY}
							width={tooltipWidth}
							height={tooltipHeight}
							rx="4"
							fill="rgba(0,0,0,0.6)"
						/>
						<text
							x={tooltipX + tooltipWidth / 2}
							y={tooltipY + 14}
							textAnchor="middle"
							fill="white"
							fontSize="10"
							fontWeight="600"
						>
							{sel.val.toFixed(2)} drinks
						</text>
						<text
							x={tooltipX + tooltipWidth / 2}
							y={tooltipY + 28}
							textAnchor="middle"
							fill="rgba(255,255,255,0.7)"
							fontSize="9"
						>
							{dateFormat(sel.t, 'h:mm a')}
						</text>
					</>
				)}
			</svg>
		</div>
	);
}

export default function Drinktracker() {
	const [anchor, setAnchor] = useState(null);
	const { drinks, addDrink, removeDrink, clearDrinks } = useDrinks();
	const { saveSession } = useSessions();

	function newSession() {
		saveSession(drinks);
		clearDrinks();
	}

	const [now, setNow] = useState(new Date());
	const [menu, setMenu] = useState(false);
	const timeHandleRef = useRef(null);

	const [deferredInstallPrompt] = useDeferredInstallPrompt();

	useEffect(() => {
		function setUpRenderInterval() {
			setNow(new Date());
			timeHandleRef.current = setInterval(() => {
				setNow(new Date());
			}, 15000);
		}
		setUpRenderInterval();

		return function cleanUpRenderInterval() {
			clearInterval(timeHandleRef.current);
		};
	}, []);

	function toggleMenu() {
		setMenu(!menu);
	}

	const currentDrinksValue = currentDrinks({ drinks, now });
	const danger = currentDrinksValue >= 6;
	const warning = currentDrinksValue >= 4 && currentDrinksValue < 6;
	const colourClass = classnames({
		'is-warning': warning,
		'is-danger': danger,
	});
	return (
		<div
			onClick={() => {
				if (menu) {
					toggleMenu();
				}
			}}
		>
			<Nav menu={menu} toggleMenu={toggleMenu} colourClass={colourClass} />
			<CurrentDrinks currentDrinks={currentDrinksValue} setAnchor={setAnchor}>
				<SessionSparkline drinks={drinks} now={now} />
			</CurrentDrinks>
			<section className="section">
				<div className="container">
					<NewDrink addDrink={addDrink} colourClass={colourClass} />
					<DrinksList
						drinks={drinks}
						removeDrink={removeDrink}
						currentDrinks={currentDrinksValue}
					/>
					{drinks && drinks.length > 0 && (
						<button
							className="button"
							style={{ marginTop: '2rem' }}
							onClick={newSession}
						>
							<span className="icon">
							<FontAwesomeIcon icon={faPlus} />
						</span>
						<span>New session</span>
						</button>
					)}
				</div>
			</section>
			<footer className="footer">
				<div className="container">
					<div className="content has-text-centered">
						<a
							href={process.env.REACT_APP_FEEDBACK_FORM}
							target="_blank"
							rel="noopener noreferrer"
						>
							Submit Feedback
						</a>
						<p>
							&copy; <a href="https://tweeres.ca">Tyler Weeres</a>
						</p>
						<p>
							Icon by{' '}
							<a
								href="https://www.flaticon.com/authors/smashicons"
								title="Smashicons"
							>
								Smashicons
							</a>
						</p>
						<p>
							<Link to="/terms">Terms of Service</Link>
						</p>
					</div>
				</div>
			</footer>
			<InstallNotification deferredInstallPrompt={deferredInstallPrompt} />
			<CurrentDrinksExplainer anchor={anchor} drinks={drinks} />
		</div>
	);
}
