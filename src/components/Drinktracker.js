import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { get, set } from 'idb-keyval';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import amplitude from 'amplitude-js';

import currentDrinks from '../currentDrinks';

import Nav from './Nav';
import Tour from './Tour';
import CurrentDrinks from './CurrentDrinks';
import NewDrink from './NewDrink';
import Drinks from './Drinks';

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

export default function Drinktracker() {
	const { drinks, addDrink, removeDrink, clearDrinks } = useDrinks();
	const [now, setNow] = useState(new Date());
	const [menu, setMenu] = useState(false);
	const timeHandleRef = useRef(null);

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
			<Tour />
			<CurrentDrinks
				currentDrinks={currentDrinksValue}
				now={now}
				colourClass={colourClass}
			/>
			<section className="section">
				<div className="container">
					<NewDrink addDrink={addDrink} colourClass={colourClass} />
					<Drinks
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
