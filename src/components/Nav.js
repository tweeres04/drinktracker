import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

export default function Nav({ menu, toggleMenu }) {
	return (
		<nav className="navbar is-primary">
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					Drinktracker
				</Link>
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
						Feedback
					</a>
				</div>
			</div>
		</nav>
	);
}
