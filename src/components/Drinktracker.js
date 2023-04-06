import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { get, set } from 'idb-keyval';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import amplitude from 'amplitude-js';

import currentDrinks from '../currentDrinks';

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
			const drinks = prevState.filter((d) => d != drink);
			set('drinks', drinks);
			return drinks;
		});
		amplitude.getInstance().logEvent('drink_removed');
		window.gtag('event', 'Drink removed', {
			event_category: 'Drinks',
		});
	}

	async function clearDrinks() {
		set('drinks', []);
		setDrinks([]);
		amplitude.getInstance().logEvent('drinks_cleared');
		window.gtag('event', 'Drinks cleared', {
			event_category: 'Drinks',
		});
	}

	return {
		drinks,
		addDrink,
		removeDrink,
		clearDrinks,
	};
}

function InstallNotification({ deferredInstallPrompt }) {
	const [showInstallNotification, setShowInstallNotification] = useState(false);
	const [isIos, setIsIos] = useState(false);

	useEffect(() => {
		const isStandalone = window.matchMedia('(display-mode: standalone)')
			.matches;
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

export default function Drinktracker() {
	const { drinks, addDrink, removeDrink, clearDrinks } = useDrinks();
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
			<CurrentDrinks
				currentDrinks={currentDrinksValue}
				now={now}
				colourClass={colourClass}
			/>
			<section className="section">
				<div className="container">
					<NewDrink addDrink={addDrink} colourClass={colourClass} />
					<DrinksList
						drinks={drinks}
						removeDrink={removeDrink}
						currentDrinks={currentDrinksValue}
					/>
					<button
						className="button is-danger"
						style={{ marginTop: '2rem' }}
						onClick={clearDrinks}
					>
						<span className="icon">
							<FontAwesomeIcon icon={faMinusCircle} />
						</span>
						<span>Clear drinks</span>
					</button>
				</div>
			</section>
			<InstallNotification deferredInstallPrompt={deferredInstallPrompt} />
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
		</div>
	);
}
