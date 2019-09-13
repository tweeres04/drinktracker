import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { get, set } from 'idb-keyval';

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
		seenHelp: true
	};
	componentDidMount() {
		this.showHelpIfFirstVisit();
	}
	showHelpIfFirstVisit = async () => {
		const seenHelp = await get('seenHelp');
		if (!seenHelp) {
			this.setState({ seenHelp });
			set('seenHelp', true);
		}
	};
	render() {
		const { seenHelp } = this.state;
		return (
			<Router>
				<div className="App">
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
