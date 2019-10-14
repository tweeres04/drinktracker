import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

export default function Nav({ menu, toggleMenu, colourClass }) {
	const [deferredInstallPrompt, setDeferredInstallPrompt] = useState();
	useEffect(() => {
		window.deferredInstallPrompt.then(e => {
			setDeferredInstallPrompt(e);
		});
	}, []);
	return (
		<nav className={classnames('navbar is-primary', colourClass)}>
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					Drinktracker
				</Link>
				{deferredInstallPrompt && (
					<div className="navbar-item">
						<button
							className="button is-primary is-inverted is-rounded"
							onClick={async () => {
								deferredInstallPrompt.prompt();
								const choiceResult = await deferredInstallPrompt.userChoice;
								if (choiceResult.outcome === 'accepted') {
									window.ga(
										'send',
										'event',
										'App install',
										'Accepted add to home screen'
									);
								} else {
									window.ga(
										'send',
										'event',
										'App install',
										'Dismissed add to home screen'
									);
								}
								setDeferredInstallPrompt(null);
							}}
						>
							Install
						</button>
					</div>
				)}
				<div
					className={classnames('navbar-burger burger', {
						'is-active': menu
					})}
					onClick={toggleMenu}
				>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
			<div className={classnames('navbar-menu', { 'is-active': menu })}>
				<div className="navbar-start">
					<Link to="/help" className="navbar-item">
						Help
					</Link>
					<a href={process.env.REACT_APP_FEEDBACK_FORM} className="navbar-item">
						Submit Feedback
					</a>
				</div>
			</div>
		</nav>
	);
}
