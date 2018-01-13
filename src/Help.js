import React from 'react';

export default function Help({ show, toggle }) {
	return (
		show && (
			<div className={`modal${show ? ' is-active' : ''}`}>
				<div className="modal-background" onClick={toggle} />
				<div className="modal-content">
					<div className="box content">
						<h3>How to use Drinktracker</h3>
						<p>The liver processes 1 standard drink per hour.</p>
						<p>
							Enter the number of standard drinks you've consumed
							and at what time, and the app will tell you how many
							drinks are in your body.
						</p>
						<h5>Non-standard Drinks</h5>
						<p>
							For non-standard drinks a little math is required,
							but even if Drinktracker isn't 100% accurately used,
							it should still be useful as a means of being more
							mindful of how many drinks you're having and how
							fast you're having them
						</p>
						<h5>Your drunk level</h5>
						<p>
							Your actual level of drunkenness will depend on your
							height, weight, and other factors. For example, 2
							drinks in one person's body may be a different level
							of drunkenness than another person at 2 drinks.
						</p>
						<p className="is-size-5">Here's to moderation! 🍻</p>
						<h3>Common Standard drinks</h3>
						<ul>
							<li>🍺 12oz serving of 5% alcohol - Beer</li>
							<li>🍷 5oz serving of 12% alcohol - Wine</li>
							<li>
								🍸 1.5oz serving of 40% alcohol - Hard liquor
							</li>
						</ul>
						<h3>Common non-standard drinks</h3>
						<ul>
							<li>
								🍺 A 20oz pint of beer - 1.66 standard drinks
								(20oz is 1.66x a standard 12oz)
							</li>
							<li>
								🍺 A 20oz pint of 7% beer (Common for IPAs) -
								2.33 standard drinks (20oz is 1.66 x a standard
								12oz, and 7% is 1.4x a standard 5% drink)
							</li>
							<li>
								🍺 A 12oz serving of 7% beer - 1.4 standard
								drinks (7% is 1.4x a standard 5% drink)
							</li>
							<li>
								🍷 A 9oz serving of 12% wine - 1.8 standard
								drinks (9oz is 1.8x the standard 5oz)
							</li>
						</ul>
					</div>
				</div>
				<button className="modal-close is-large" onClick={toggle} />
			</div>
		)
	);
}
