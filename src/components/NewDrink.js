import React, { Component } from 'react';
import TimePicker from 'react-datetime';
import _toNumber from 'lodash/fp/toNumber';
import subtractDays from 'date-fns/sub_days';
import closestDate from 'date-fns/closest_to';
import isDate from 'date-fns/is_date';

import { drinkFactory, Section } from '../App';

export default class NewDrink extends Component {
	constructor(props) {
		super(props);

		this.state = {
			time: new Date(),
			timeError: false,
			value: 1,
			valueError: false
		};

		this.handleTimeChange = this.handleTimeChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	render() {
		const { time, timeError, value, valueError } = this.state;

		return (
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
						<p className="help is-danger">Enter a valid time.</p>
					)}
				</div>
				<div className="field">
					<label className="label">Drinks</label>
					<div className="control">
						<input
							className={`input${valueError ? ' is-danger' : ''}`}
							name="value"
							type="number"
							value={value}
							onChange={this.handleChange}
						/>
					</div>
					{valueError && (
						<p className="help is-danger">
							Enter a number greater than 0.
						</p>
					)}
				</div>
				<button
					className="button is-primary is-fullwidth"
					onClick={this.handleSubmit}
				>
					Drink!
				</button>
			</Section>
		);
	}
	handleTimeChange(value) {
		// Handle possibly going past midnight. Just pick whatever day is closest to now. Will need to test this further
		let time = value.toDate ? value.toDate() : value;
		if (isDate(time)) {
			const possibleDays = [time, subtractDays(time, 1)];
			time = closestDate(new Date(), possibleDays);
		}
		this.setState({ time, timeError: false });
	}
	handleChange({ target: { value, name } }) {
		value = value == '' ? value : _toNumber(value);
		this.setState({ [name]: value, valueError: false });
	}
	handleSubmit() {
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
	}
	now = () => {
		this.setState({ time: new Date(), timeError: false });
	};
}
