import React, { Component, lazy } from 'react';

const Modal = lazy(() => import('./Modal'));

export default class DrinkCalculator extends Component {
	state = {
		show: false
	};
	render() {
		const { show } = this.state;
		const { setDrinks } = this.props;
		return (
			<>
				<button className="button" onClick={this.toggleModal}>
					Calculator
				</button>
				{show ? <Modal setDrinks={setDrinks} close={this.toggleModal} /> : null}
			</>
		);
	}
	toggleModal = () => {
		this.setState(({ show }) => {
			window.gtag('event', `Drink calculator ${show ? 'opened' : 'closed'}`, {
				event_category: 'Drink calculator'
			});
			return { show: !show };
		});
	};
}
