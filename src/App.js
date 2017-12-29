import React, { Component } from 'react';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import dateFormat from 'date-fns/format';
import parseDate from 'date-fns/parse';
import idbKeyval from 'idb-keyval';

import Drinks from './components/Drinks';
import NewDrink from './components/NewDrink';

import 'bulma/css/bulma.css';
import 'react-datetime/css/react-datetime.css';

export function drinkFactory({ time, value }) {
	return {
		time,
		value
	};
}

export function currentDrinks({ drinks, now = new Date() }) {
	const today = dateFormat(now, 'YYYY-MM-DD');
	return drinks.reduce((drinks, { time, value }) => {
		const dateTime = parseDate(`${today}T${time}`);
		const minsSinceDrink = differenceInMinutes(now, dateTime);
		const effectiveDrinks =
			minsSinceDrink == 0
				? 1 * value
				: minsSinceDrink > 59 ? 0 : (1 - minsSinceDrink / 60) * value;
		drinks += effectiveDrinks;
		return drinks;
	}, 0);
}

export function Section({ children, className }) {
	return (
		<div className={`columns${className ? ` ${className}` : ''}`}>
			<div className="column">{children}</div>
		</div>
	);
}

function CurrentDrinks({ drinks, now }) {
	return (
		<section className="hero is-primary">
			<div className="hero-body">
				<div className="container has-text-centered">
					<h1 className="title">
						{currentDrinks({ drinks, now }).toFixed(2)}
					</h1>
					<h2 className="subtitle">drinks in your system</h2>
				</div>
			</div>
		</section>
	);
}

export default class App extends Component {
	state = {
		drinks: null,
		now: new Date()
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
		const { drinks, now } = this.state;
		return (
			drinks && (
				<div className="App">
					<CurrentDrinks drinks={drinks} now={now} />
					<section className="section">
						<div className="container">
							<NewDrink addDrink={this.addDrink} />
							<Drinks drinks={drinks} />
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
								<p>&copy; 2017 Tweeres Software</p>
							</div>
						</div>
					</footer>
				</div>
			)
		);
	}
	loadDrinks = async () => {
		const drinks = (await idbKeyval.get('drinks')) || [];
		this.setState({ drinks });
	};
	addDrink = drink => {
		this.setState(prevState => {
			const drinks = prevState.drinks.concat(drink);
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
