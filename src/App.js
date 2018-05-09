import React, { Component } from 'react';
import idbKeyval from 'idb-keyval';

import currentDrinks from './currentDrinks';

import Drinks from './components/Drinks';
import NewDrink from './components/NewDrink';
import Help from './components/Help';
import CurrentDrinks from './components/CurrentDrinks';
import classnames from 'classnames';

import 'bulma/css/bulma.css';
import 'react-datetime/css/react-datetime.css';
import './App.css';

export function drinkFactory({ time, value }) {
	return {
		time,
		value
	};
}

export function Section({ children, className }) {
	return (
		<div className={`columns${className ? ` ${className}` : ''}`}>
			<div className="column">{children}</div>
		</div>
	);
}

function TopButton({ currentDrinksValue, left, right, label, action }) {
	const buttonClasses = classnames('button is-text', {
		'has-text-white': currentDrinksValue < 6 || currentDrinksValue >= 8
	});
	const buttonStyles = Object.assign(
		{ position: 'absolute' },
		left ? { left: 0 } : right ? { right: 0 } : {}
	);
	return (
		<button className={buttonClasses} onClick={action} style={buttonStyles}>
			{label}
		</button>
	);
}

export default class App extends Component {
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
	render() {
		const { drinks, now, help } = this.state;
		const currentDrinksValue = currentDrinks({ drinks, now });
		return (
			drinks && (
				<div className="App">
					<TopButton
						currentDrinksValue={currentDrinksValue}
						left={true}
						label="Help"
						action={this.toggleHelp}
					/>
					<TopButton
						currentDrinksValue={currentDrinksValue}
						right={true}
						label="Feedback"
						action={this.openFeedbackForm}
					/>
					<Help show={help} toggle={this.toggleHelp} />
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
								<p>&copy; 2018 Tweeres Software</p>
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
				</div>
			)
		);
	}
	toggleHelp = () => {
		this.setState(({ help }) => ({ help: !help }));
	};
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
}
