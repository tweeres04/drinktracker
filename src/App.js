import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Drinktracker from './components/Drinktracker';

import 'bulma/css/bulma.css';
import 'react-datetime/css/react-datetime.css';
import './App.css';

const Help = lazy(() => import('./components/Help'));
const Terms = lazy(() => import('./components/Terms'));

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
	render() {
		return (
			<Suspense fallback={null}>
				<Router>
					<div className="App">
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
						<Route
							path="/terms"
							render={({ history }) => (
								<Terms
									toggle={() => {
										history.push('/');
									}}
								/>
							)}
						/>
						<Route path="/" component={Drinktracker} />
					</div>
				</Router>
			</Suspense>
		);
	}
}
