import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { track } from '../analytics';

// The marketing site, not this app. A friend who lands straight in an empty
// tracker gets no explanation of what it's for.
const shareUrl = 'https://drinktracker.app';

export default function Nav({ menu, toggleMenu, colourClass }) {
	const [copied, setCopied] = useState(false);

	async function shareApp(event) {
		// The href is a no-JS fallback only; normally we share or copy in place.
		event.preventDefault();

		track('share_app', {
			method: navigator.share ? 'share_sheet' : 'clipboard',
		});

		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Drinktracker',
					text: "Log each drink and see where you're at, not just a count.",
					url: shareUrl,
				});
			} catch (error) {
				// Dismissing the share sheet rejects with AbortError, and index.js
				// reports unhandled rejections to GA as exceptions.
				if (error.name !== 'AbortError') {
					throw error;
				}
			}
			return;
		}

		await navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<nav className={classnames('navbar is-primary', colourClass)}>
			<div className="navbar-brand">
				<Link className="navbar-item" to="/">
					Drinktracker
				</Link>
				<div
					className={classnames('navbar-burger burger', {
						'is-active': menu,
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
					<Link to="/history" className="navbar-item">
						History
					</Link>
					<Link to="/help" className="navbar-item">
						Help
					</Link>
					<a href={process.env.REACT_APP_FEEDBACK_FORM} className="navbar-item">
						Submit Feedback
					</a>
					<a className="navbar-item" href={shareUrl} onClick={shareApp}>
						{copied ? 'Link copied' : 'Share Drinktracker'}
					</a>
				</div>
			</div>
		</nav>
	);
}
