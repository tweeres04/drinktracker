import React, { Component } from 'react';
import idbKeyval from 'idb-keyval';

import Drinks from './components/Drinks';
import NewDrink from './components/NewDrink';
import Help from './components/Help';
import CurrentDrinks from './components/CurrentDrinks';

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
