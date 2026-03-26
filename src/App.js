import React, { Component, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Drinktracker from './components/Drinktracker';

import './App.scss';

const Help = lazy(() => import('./components/Help'));
const Terms = lazy(() => import('./components/Terms'));
const History = lazy(() => import('./components/History'));

export function drinkFactory({ time, value }) {
	return {
		time: new Date(time),
		value,
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
						<Switch>
							<Route path="/history" component={History} />
							<Route path="/" component={Drinktracker} />
						</Switch>
					</div>
				</Router>
			</Suspense>
		);
	}
}
