import React, { Component } from 'react';

import { Modal } from '.';

export default class DrinkAdder extends Component {
	state = {
		show: false
	};
	render() {
		const { show } = this.state;
		const { setDrinks } = this.props;
		return [
			<button className="button" key="button" onClick={this.toggleModal}>
				Calculator
			</button>,
			<Modal
				setDrinks={setDrinks}
				show={show}
				close={this.toggleModal}
				key="modal"
			/>
		];
	}
	toggleModal = () => {
		this.setState(({ show }) => ({ show: !show }));
	};
}
