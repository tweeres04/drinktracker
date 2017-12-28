import React, { Component } from 'react';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import dateFormat from 'date-fns/format';

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
		const minsSinceDrink = differenceInMinutes(now, `${today}:${time}`);
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
	constructor(props) {
		super(props);

		this.state = {
			drinks: [],
			now: new Date()
		};

		this.addDrink = this.addDrink.bind(this);
	}
	componentDidMount() {
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
			<div className="App">
				<CurrentDrinks drinks={drinks} now={now} />
				<section className="section">
					<div className="container">
						<NewDrink addDrink={this.addDrink} />
						<Drinks drinks={drinks} />
					</div>
				</section>
			</div>
		);
	}
	addDrink(drink) {
		this.setState(prevState => {
			return {
				drinks: prevState.drinks.concat(drink)
			};
		});
	}
}
