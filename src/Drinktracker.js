import React, { Component, Fragment } from 'react';

import idbKeyval from 'idb-keyval';

import currentDrinks from './currentDrinks';

import CurrentDrinks from './components/CurrentDrinks';
import NewDrink from './components/NewDrink';
import Drinks from './components/Drinks';

import { drinkFactory } from './App';

export default class Drinktracker extends Component {
	state = {
		drinks: null,
		now: new Date(),
		help: false
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
	openFeedbackForm = () => {
		window.open(process.env.REACT_APP_FEEDBACK_FORM, '_blank');
	};
	loadDrinks = async () => {
		const drinks = (await idbKeyval.get('drinks')) || [];
		this.setState({ drinks });
	};
	addDrink = drink => {
		this.setState(prevState => {
			const drinks = prevState.drinks.concat(drink).map(drinkFactory);
			idbKeyval.set('drinks', drinks);
			return {
				drinks
			};
		});
	};
	removeDrink = drink => {
		this.setState(prevState => {
			const drinks = prevState.drinks.filter(d => d != drink);
			idbKeyval.set('drinks', drinks);
			return {
				drinks
			};
		});
	};
	reset = async () => {
		idbKeyval.clear();
		this.setState({ drinks: [] });
	};
	render() {
		const { drinks, now } = this.state;
		const currentDrinksValue = currentDrinks({ drinks, now });
		return (
			<Fragment>
				<CurrentDrinks currentDrinks={currentDrinksValue} now={now} />
				<section className="section">
					<div className="container">
						<NewDrink addDrink={this.addDrink} />
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
							<a href={process.env.REACT_APP_FEEDBACK_FORM} target="_blank">
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
						</div>
					</div>
				</footer>
			</Fragment>
		);
	}
}
