import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { useDeferredInstallPrompt } from '../installableApp';

export default function Nav({ menu, toggleMenu, colourClass }) {
	const [
		deferredInstallPrompt,
		setDeferredInstallPrompt
	] = useDeferredInstallPrompt();
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
									window.gtag('event', 'Accepted add to home screen', {
										event_category: 'App install'
									});
								} else {
									window.gtag('event', 'Dismissed add to home screen', {
										event_category: 'App install'
									});
								}
								setDeferredInstallPrompt(null);
							}}
							data-tour="install"
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
