import React, { Component } from 'react';
import _round from 'lodash/round';
import _uniqWith from 'lodash/uniqWith';
import _isEqual from 'lodash/isEqual';
import { get, set } from 'idb-keyval';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

export function getDrinks({ percent, volume, unit }) {
	const alcInStandardDrink =
		unit == 'ml' ? 17.7441 : unit == 'cl' ? 1.77441 : 0.6;
	const drinks = _round(percent / 100 * volume / alcInStandardDrink, 2);
	return drinks;
}

async function storeState({ percent, volume, unit }) {
	let latestDrinks = await get('drinkCalculatorState');
	latestDrinks = latestDrinks
		? latestDrinks.length ? latestDrinks : [latestDrinks]
		: [];
	latestDrinks = [{ percent, volume, unit }, ...latestDrinks];
	latestDrinks = _uniqWith(latestDrinks, _isEqual);
	latestDrinks = latestDrinks.slice(0, 5);
	return set('drinkCalculatorState', latestDrinks);
}

async function loadState() {
	const latestDrinks = await get('drinkCalculatorState');
	let latestDrink = latestDrinks
		? latestDrinks.length ? latestDrinks[0] : latestDrinks
		: {};
	const state = {
		currentDrink: {
			percent: 5,
			volume: 12,
			unit: 'oz',
			...latestDrink
		},
		loading: false,
		latestDrinks
	};
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
	render() {
		const { loading, currentDrink = {}, latestDrinks } = this.state;
		const { percent, volume, unit } = currentDrink;
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
							{latestDrinks &&
								latestDrinks.length && (
									<div className="field">
										<label className="label">
											Recent results (tap to re-use)
										</label>
										<div className="tags are-large">
											{latestDrinks.map(({ percent, volume, unit }) => (
												<span
													className="tag is-link is-light"
													onClick={() => {
														this.save({ percent, volume, unit });
													}}
												>{`${percent}%, ${volume}${unit}`}</span>
											))}
										</div>
									</div>
								)}
							<div className="field">
								<label className="label">Standard drinks</label>
								<div className="control is-size-3 has-text-centered">
									{drinks}
								</div>
							</div>
							<div className="field">
								<button
									className="button is-primary is-medium is-fullwidth"
									onClick={() => {
										this.save(this.state.currentDrink);
									}}
								>
									<span className="icon">
										<FontAwesomeIcon icon={faThumbsUp} />
									</span>
									<span>
										Use {drinks} standard drink{drinks == 1 ? '' : 's'}
									</span>
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
		let { volume } = this.state.currentDrink;
		const unitCoefficient = 0.033814;
		volume =
			value == 'oz'
				? volume * unitCoefficient
				: value == 'ml' ? volume / unitCoefficient : volume;
		volume = _round(volume, 2).toString();
		this.setState({
			currentDrink: { ...this.state.currentDrink, unit: value, volume }
		});
	};
	handleChange = ({ target: { value, name } }) => {
		this.setState({
			currentDrink: { ...this.state.currentDrink, [name]: value }
		});
	};
	save = ({ percent, volume, unit }) => {
		const { setDrinks, close } = this.props;

		setDrinks(getDrinks({ percent, volume, unit }));
		close();
		storeState({ percent, volume, unit });
		window.gtag('event', 'Drink calculator used', {
			event_category: 'Drink calculator'
		});
	};
}
