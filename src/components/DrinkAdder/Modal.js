import React, { Component } from 'react';
import _round from 'lodash/round';
import { get, set } from 'idb-keyval';
import 'bulma/css/bulma.css';

export function getDrinks({ percent, volume, unit }) {
	const alcInStandardDrink =
		unit == 'ml' ? 17.7441 : unit == 'cl' ? 1.77441 : 0.6;
	const drinks = _round(((percent / 100) * volume) / alcInStandardDrink, 2);
	return drinks;
}

function storeState({ percent, volume, unit }) {
	return set('drinkAdderState', { percent, volume, unit });
}

async function loadState() {
	const state = Object.assign(
		{
			percent: 5,
			volume: 12,
			unit: 'oz'
		},
		{ loading: false },
		await get('drinkAdderState')
	);
	return state;
}

export default class Modal extends Component {
	state = {
		loading: true
	};
	async componentDidMount() {
		const state = await loadState();
		this.setState(state);
	}
	componentDidUpdate() {
		storeState(this.state);
	}
	render() {
		const { loading, percent, volume, unit } = this.state;
		const { close } = this.props;
		const drinks = getDrinks({ percent, volume, unit });
		return (
			<div className={'modal is-active'}>
				<div className="modal-background" />
				<div className="modal-content">
					{loading || (
						<div className="box">
							<label className="label">Alcohol percent (%)</label>
							<div className="field has-addons">
								<div className="control is-expanded">
									<input
										type="number"
										className="input"
										placeholder="Alcohol percent"
										name="percent"
										value={percent}
										onChange={this.handleChange}
									/>
								</div>
								<div className="control">
									<button className="button is-static" tabIndex="-1">
										%
									</button>
								</div>
							</div>
							<label htmlFor="" className="label">
								Alcohol volume ({unit})
							</label>
							<div className="field has-addons">
								<div className="control is-expanded">
									<input
										type="number"
										className="input"
										placeholder="Alcohol volume"
										name="volume"
										value={volume}
										onChange={this.handleChange}
									/>
								</div>
								<div className="control">
									<span className="select">
										<select
											name="unit"
											value={unit}
											onChange={this.handleUnitChange}
										>
											<option value="oz">oz</option>
											<option value="ml">ml</option>
										</select>
									</span>
								</div>
							</div>
							<div className="field">
								<label className="label">Standard drinks</label>
								<div className="control is-size-3 has-text-centered">
									{drinks}
								</div>
							</div>
							<div className="field">
								<button
									className="button is-primary is-medium is-fullwidth"
									onClick={this.save}
								>
									Use {drinks} standard drink{drinks == 1 ? '' : 's'}
								</button>
							</div>
						</div>
					)}
				</div>
				<button className="modal-close is-large" onClick={close} />
			</div>
		);
	}
	handleUnitChange = ({ target: { value } }) => {
		let { volume } = this.state;
		const unitCoefficient = 0.033814;
		volume =
			value == 'oz'
				? volume * unitCoefficient
				: value == 'ml'
				? volume / unitCoefficient
				: volume;
		volume = _round(volume, 2);
		this.setState({ unit: value, volume }, () => {});
	};
	handleChange = ({ target: { value, name } }) => {
		this.setState({ [name]: value });
	};
	save = () => {
		const { percent, volume, unit } = this.state;
		const { setDrinks, close } = this.props;

		setDrinks(getDrinks({ percent, volume, unit }));
		close();
		window.ga('send', 'event', 'Drink calculator', 'Drink calculator used');
	};
}
