import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { get, set, clear } from 'idb-keyval';

import currentDrinks from '../currentDrinks';

import Nav from './Nav';
import CurrentDrinks from './CurrentDrinks';
import NewDrink from './NewDrink';
import Drinks from './Drinks';

import { drinkFactory } from './../App';

export default class Drinktracker extends Component {
	state = {
		drinks: null,
		now: new Date(),
		menu: false
	};
	componentDidMount() {
		this.loadDrinks();
		this.timeHandle = setInterval(() => {
			this.setState({ now: new Date() });
		}, 30000);
	}
	componentWillUnmount() {
		clearInterval(this.timeHandle);
	}
	toggleMenu = () => {
		const { menu } = this.state;
		this.setState({
			menu: !menu
		});
	};
	loadDrinks = async () => {
		const drinks = (await get('drinks')) || [];
		this.setState({ drinks });
	};
	addDrink = drink => {
		this.setState(prevState => {
			const drinks = prevState.drinks.concat(drink).map(drinkFactory);
			set('drinks', drinks);
			return {
				drinks
			};
		});
		window.ga('send', 'event', 'Drinks', 'Drink added');
	};
	removeDrink = drink => {
		this.setState(prevState => {
			const drinks = prevState.drinks.filter(d => d != drink);
			set('drinks', drinks);
			return {
				drinks
			};
		});
		window.ga('send', 'event', 'Drinks', 'Drink removed');
	};
	reset = async () => {
		clear();
		this.setState({ drinks: [] });
		window.ga('send', 'event', 'Drinks', 'Drinks cleared');
	};
	render() {
		const { drinks, now, menu } = this.state;
		const currentDrinksValue = currentDrinks({ drinks, now });
		const danger = currentDrinksValue >= 8;
		const warning = currentDrinksValue >= 6 && currentDrinksValue < 8;
		const colourClass = classnames({
			'is-warning': warning,
			'is-danger': danger
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
						<button className="button is-outlined" onClick={this.reset}>
							Reset
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
