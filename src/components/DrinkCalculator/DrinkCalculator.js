import React, { Component, lazy } from 'react';

import amplitude from 'amplitude-js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

const Modal = lazy(() => import('./Modal'));

export default class DrinkCalculator extends Component {
	state = {
		show: false,
	};
	render() {
		const { show } = this.state;
		const { setDrinks } = this.props;
		return (
			<>
				<div className="control">
					<button className="button is-info" onClick={this.toggleModal}>
						<span className="icon">
							<FontAwesomeIcon icon={faCalculator} />
						</span>
						<span>Calculator</span>
					</button>
				</div>
				{show ? <Modal setDrinks={setDrinks} close={this.toggleModal} /> : null}
			</>
		);
	}
	toggleModal = () => {
		this.setState(({ show }) => {
			amplitude
				.getInstance()
				.logEvent(`drink_calculator_${show ? 'opened' : 'closed'}`);
			window.gtag('event', `Drink calculator ${show ? 'opened' : 'closed'}`, {
				event_category: 'Drink calculator',
			});
			return { show: !show };
		});
	};
}
