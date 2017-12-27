import React, { Component } from 'react';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import dateFormat from 'date-fns/format';

import './App.css';

export function drinkFactory({ time, value }) {
	return {
		time,
		value
	};
}

export function currentDrinks(drinks) {
	const now = new Date();
	const today = dateFormat(now, 'YYYY-MM-DD');
	return drinks.reduce((drinks, drink) => {
		const minsSinceDrink = differenceInMinutes(
			now,
			`${today}:${drink.time}`
		);
		const effectiveDrinks =
			minsSinceDrink == 0
				? 1
				: minsSinceDrink > 59
					? 0
					: (1 - minsSinceDrink / 60) * drink.value;
		drinks += effectiveDrinks;
		return drinks;
	}, 0);
}

class NewDrink extends Component {
	constructor(props) {
		super(props);

		this.state = {
			time: dateFormat(new Date(), 'HH:mm'),
			value: 1
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	render() {
		const { time, value } = this.state;
		return (
			<div className="new-drink">
				<div className="time">
					<input
						name="time"
						type="text"
						value={time}
						onChange={this.handleChange}
					/>
				</div>
				<div className="value">
					<input
						name="value"
						type="number"
						value={value}
						onChange={this.handleChange}
					/>
				</div>
				<button onClick={this.handleSubmit}>Drink!</button>
			</div>
		);
	}
	handleChange({ target: { value, name } }) {
		this.setState({ [name]: value });
	}
	handleSubmit() {
		const { addDrink } = this.props;
		const { time, value } = this.state;
		addDrink(
			drinkFactory({
				time,
				value
			})
		);
	}
}

function Drinks({ drinks }) {
	const drinkListItems = drinks.map((drink, i) => (
		<li key={i}>
			<div className="label">Drink at</div>
			<div className="value">{drink.time}</div>
		</li>
	));
	return <ul className="drink-list">{drinkListItems}</ul>;
}

export default class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			drinks: []
		};

		this.addDrink = this.addDrink.bind(this);
	}
	render() {
		const { drinks } = this.state;
		return (
			<div className="App">
				<div className="current-drinks">
					<div className="value">
						{currentDrinks(drinks).toFixed(2)}
					</div>
					<div className="label">drinks in your system</div>
				</div>
				<NewDrink addDrink={this.addDrink} />
				<Drinks drinks={drinks} />
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
