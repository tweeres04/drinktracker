import React, { Component } from 'react';
import TimePicker from 'react-datetime';
import _toNumber from 'lodash/fp/toNumber';
import subtractDays from 'date-fns/sub_days';
import closestDate from 'date-fns/closest_to';

import { drinkFactory, Section } from '../App';

export default class NewDrink extends Component {
	constructor(props) {
		super(props);

		this.state = {
			time: new Date(),
			value: 1
		};

		this.handleTimeChange = this.handleTimeChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	render() {
		const { time, value } = this.state;

		return (
			<Section>
				<label className="label">Time</label>
				<div className="field has-addons">
					<div className="control is-expanded">
						<TimePicker
							inputProps={{
								className: 'input'
							}}
							dateFormat={false}
							timeFormat="HH:mm"
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
				<div className="field">
					<label className="label">Drinks</label>
					<div className="control">
						<input
							className="input"
							name="value"
							type="number"
							value={value}
							onChange={this.handleChange}
						/>
					</div>
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
		const possibleDays = [time, subtractDays(time, 1)];
		time = closestDate(new Date(), possibleDays);
		this.setState({ time });
	}
	handleChange({ target: { value, name } }) {
		value = value == '' ? value : _toNumber(value);
		this.setState({ [name]: value });
	}
	handleSubmit() {
		const { addDrink } = this.props;
		const { time, value } = this.state;
		if (value > 0) {
			addDrink(
				drinkFactory({
					time,
					value
				})
			);
		}
	}
	now = () => {
		this.setState({ time: new Date() });
	};
}
