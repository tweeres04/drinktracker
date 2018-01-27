import React, { Component } from 'react';
import TimePicker from 'react-datetime';
import _toNumber from 'lodash/fp/toNumber';
import subtractDays from 'date-fns/sub_days';
import closestDate from 'date-fns/closest_to';
import isDate from 'date-fns/is_date';
import idbKeyval from 'idb-keyval';

import { drinkFactory, Section } from '../App';
import DrinkAdder from './DrinkAdder';

async function loadState() {
	return Object.assign(
		{
			time: new Date(),
			timeError: false,
			value: 1,
			valueError: false
		},
		{ loading: false },
		{ value: await idbKeyval.get('drinkValue') }
	);
}

export default class NewDrink extends Component {
	state = {
		loading: true
	};
	async componentDidMount() {
		const state = await loadState();
		this.setState(state);
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden) {
				this.now();
			}
		});
	}
	render() {
		const { time, timeError, value, valueError, loading } = this.state;

		return (
			loading || (
				<Section>
					<label className="label">Time</label>
					<div className="field">
						<div
							className="field has-addons"
							style={{ marginBottom: 0 }}
						>
							<div className="control is-expanded">
								<TimePicker
									inputProps={{
										className: `input${
											timeError ? ' is-danger' : ''
										}`
									}}
									dateFormat={false}
									timeFormat={true}
									value={time}
									onChange={this.handleTimeChange}
								/>
							</div>
							<div className="control">
								<button className="button" onClick={this.now}>
									Now
								</button>
							</div>
						</div>
						{timeError && (
							<p className="help is-danger">
								Enter a valid time.
							</p>
						)}
					</div>
					<label className="label">Standard drinks</label>
					<div className="field">
						<div
							className="field has-addons"
							style={{ marginBottom: 0 }}
						>
							<div className="control is-expanded">
								<input
									className={`input${
										valueError ? ' is-danger' : ''
									}`}
									name="value"
									type="number"
									value={value}
									onChange={this.handleChange}
								/>
							</div>
							<DrinkAdder setDrinks={this.setDrinks} />
						</div>
						{valueError && (
							<p className="help is-danger">
								Enter a number greater than 0.
							</p>
						)}
					</div>
					<button
						className="button is-primary is-fullwidth is-medium"
						onClick={this.handleSubmit}
					>
						Drink
					</button>
				</Section>
			)
		);
	}
	handleTimeChange = value => {
		// Handle possibly going past midnight. Just pick whatever day is closest to now. Will need to test this further
		let time = value.toDate ? value.toDate() : value;
		if (isDate(time)) {
			const possibleDays = [time, subtractDays(time, 1)];
			time = closestDate(new Date(), possibleDays);
		}
		this.setState({ time, timeError: false });
	};
	handleChange = ({ target: { value, name } }) => {
		value = value == '' ? value : _toNumber(value);
		this.setState({ [name]: value, valueError: false });
		if (name == 'value') {
			idbKeyval.set('drinkValue', value);
		}
	};
	setDrinks = drinks => {
		this.setState({ value: drinks });
	};
	handleSubmit = () => {
		const { addDrink } = this.props;
		const { time, value } = this.state;
		const valueError = value <= 0;
		const timeError = !isDate(time);
		if (!timeError && !valueError) {
			addDrink(
				drinkFactory({
					time,
					value
				})
			);
		} else {
			this.setState({ timeError, valueError });
		}
	};
	now = () => {
		this.setState({ time: new Date(), timeError: false });
	};
}
