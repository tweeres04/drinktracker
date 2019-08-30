import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import idbKeyval from 'idb-keyval';

import Nav from './components/Nav';
import Drinktracker from './Drinktracker';
import Help from './components/Help';

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
		menu: false,
		seenHelp: true
	};
	componentDidMount() {
		this.showHelpIfFirstVisit();
	}
	toggleMenu = () => {
		const { menu } = this.state;
		this.setState({
			menu: !menu
		});
	};
	showHelpIfFirstVisit = async () => {
		const seenHelp = await idbKeyval.get('seenHelp');
		if (!seenHelp) {
			this.setState({ seenHelp });
			idbKeyval.set('seenHelp', true);
		}
	};
	render() {
		const { menu, seenHelp } = this.state;
		return (
			<Router>
				<div
					className="App"
					onClick={e => {
						if (menu) {
							this.toggleMenu();
						}
					}}
				>
					<Nav menu={menu} toggleMenu={this.toggleMenu} />
					{seenHelp || <Redirect to="/help" />}
					<Route
						path="/help"
						render={({ history }) => (
							<Help
								show
								toggle={() => {
									history.push('/');
								}}
							/>
						)}
					/>
					<Route path="/" render={() => <Drinktracker />} />
				</div>
			</Router>
		);
	}
}
