import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { get, set } from 'idb-keyval';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import currentDrinks from '../currentDrinks';

import Nav from './Nav';
import Tour from './Tour';
import CurrentDrinks from './CurrentDrinks';
import NewDrink from './NewDrink';
import Drinks from './Drinks';

import { drinkFactory } from './../App';

export default class Drinktracker extends Component {
	state = {
		drinks: null,
		now: new Date(),
		menu: false,
	};
	componentDidMount() {
		this.loadDrinks();
		this.setUpRenderInterval();
	}
	componentWillUnmount() {
		clearInterval(this.timeHandle);
	}
	setUpRenderInterval = () => {
		this.setState({ now: new Date() });
		this.timeHandle = setInterval(() => {
			this.setState({ now: new Date() });
		}, 15000);
	};
	toggleMenu = () => {
		const { menu } = this.state;
		this.setState({
			menu: !menu,
		});
	};
	loadDrinks = async () => {
		const drinks = (await get('drinks')) || [];
		this.setState({ drinks });
	};
	addDrink = (drink) => {
		this.setState((prevState) => {
			const drinks = prevState.drinks.concat(drink).map(drinkFactory);
			set('drinks', drinks);
			return {
				drinks,
			};
		});
		window.gtag('event', 'Drink added', {
			event_category: 'Drinks',
		});
	};
	removeDrink = (drink) => {
		this.setState((prevState) => {
			const drinks = prevState.drinks.filter((d) => d != drink);
			set('drinks', drinks);
			return {
				drinks,
			};
		});
		window.gtag('event', 'Drink removed', {
			event_category: 'Drinks',
		});
	};
	reset = async () => {
		set('drinks', []);
		this.setState({ drinks: [] });
		window.gtag('event', 'Drinks cleared', {
			event_category: 'Drinks',
		});
	};
	render() {
		const { drinks, now, menu } = this.state;
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
						this.toggleMenu();
					}
				}}
			>
				<Nav
					menu={menu}
					toggleMenu={this.toggleMenu}
					colourClass={colourClass}
				/>
				<Tour />
				<CurrentDrinks
					currentDrinks={currentDrinksValue}
					now={now}
					colourClass={colourClass}
				/>
				<section className="section">
					<div className="container">
						<NewDrink addDrink={this.addDrink} colourClass={colourClass} />
						<Drinks
							drinks={drinks}
							removeDrink={this.removeDrink}
							currentDrinks={currentDrinksValue}
						/>
						<button
							className="button is-danger"
							style={{ marginTop: '2rem' }}
							onClick={this.reset}
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
							<p>&copy; Tweeres Software</p>
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
}
