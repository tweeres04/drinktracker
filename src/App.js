import React, { Component } from 'react';
import differenceInSeconds from 'date-fns/difference_in_seconds';
import addMinutes from 'date-fns/add_minutes';
import dateIsAfter from 'date-fns/is_after';
import idbKeyval from 'idb-keyval';
import _orderBy from 'lodash/fp/orderBy';
import _cloneDeep from 'lodash/fp/cloneDeep';

import Drinks from './components/Drinks';
import NewDrink from './components/NewDrink';
import Help from './Help';

import 'bulma/css/bulma.css';
import 'react-datetime/css/react-datetime.css';
import './App.css';

export function drinkFactory({ time, value }) {
	return {
		time,
		value
	};
}

export function currentDrinks({ drinks, now = new Date() }) {
	drinks = _cloneDeep(drinks);
	drinks = _orderBy('time')('asc')(drinks);

	drinks = drinks.map((drink, i) => {
		const { time, value } = drink;
		const nextDrink = drinks[i + 1] || {};

		const requiredMins = value * 60;
		const startTime = drink.startTime || time;
		const finishTime = addMinutes(startTime, requiredMins);

		drink.finishTime = finishTime;

		const nextDrinkDateTime = nextDrink.time || now;
		nextDrink.startTime = dateIsAfter(nextDrinkDateTime, finishTime)
			? nextDrink.time
			: finishTime;

		return drink;
	});

	const result = drinks.reduce((drinks, { value, finishTime }) => {
		const minsRequired = value * 60;
		const timeLeft = differenceInSeconds(finishTime, now) / 60;
		const result =
			timeLeft > minsRequired ? value : timeLeft <= 0 ? 0 : timeLeft / 60;
		return (drinks += result);
	}, 0);
	return result;
}

export function Section({ children, className }) {
	return (
		<div className={`columns${className ? ` ${className}` : ''}`}>
			<div className="column">{children}</div>
		</div>
	);
}

function CurrentDrinks({ drinks, now }) {
	const currentDrinksValue = currentDrinks({ drinks, now });
	return (
		<section
			className={`hero${
				currentDrinksValue >= 10 ? ' is-danger' : ' is-primary'
			}`}
		>
			<div className="hero-body">
				<div className="container has-text-centered">
					<h1 className="title">{currentDrinksValue.toFixed(2)}</h1>
					<h2 className="subtitle">
						drink{currentDrinksValue == 1 ? '' : 's'} in your system
					</h2>
				</div>
			</div>
		</section>
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
		return (
			drinks && (
				<div className="App">
					<button
						className="button is-text has-text-white"
						onClick={this.toggleHelp}
						style={{
							position: 'absolute',
							left: 0
						}}
					>
						Help
					</button>
					<Help show={help} toggle={this.toggleHelp} />
					<CurrentDrinks drinks={drinks} now={now} />
					<section className="section">
						<div className="container">
							<NewDrink addDrink={this.addDrink} />
							<Drinks
								drinks={drinks}
								removeDrink={this.removeDrink}
							/>
							<button
								className="button is-outlined"
								onClick={this.reset}
							>
								Reset
							</button>
						</div>
					</section>
					<footer className="footer">
						<div className="container">
							<div className="content has-text-centered">
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
