import React, { useRef, useState } from 'react';
import { format, parse, isValid } from 'date-fns';
import _toNumber from 'lodash/fp/toNumber';

import { track } from '../analytics';

export default function EditDrinkModal({ drink, onSave, onClose }) {
	const currentDrink = useRef(drink);
	const dirty = useRef(false);
	const [date, setDate] = useState(format(drink.time, 'yyyy-MM-dd'));
	const [time, setTime] = useState(format(drink.time, 'HH:mm'));
	const [value, setValue] = useState(drink.value);
	const [dateTimeError, setDateTimeError] = useState(false);
	const [valueError, setValueError] = useState(false);

	function persist(nextDate, nextTime, nextValue) {
		const newTime = parse(
			`${nextDate} ${nextTime}`,
			'yyyy-MM-dd HH:mm',
			new Date()
		);
		const newValue = _toNumber(nextValue);
		const dateTimeError = !isValid(newTime);
		const valueError = !(newValue > 0);
		setDateTimeError(dateTimeError);
		setValueError(valueError);
		if (dateTimeError || valueError) {
			return;
		}
		currentDrink.current = onSave(currentDrink.current, {
			time: newTime,
			value: newValue,
		});
		dirty.current = true;
	}

	function handleDone() {
		if (dirty.current) {
			track('drink_edited');
			window.gtag('event', 'Drink edited', {
				event_category: 'Drinks',
			});
		}
		onClose();
	}

	return (
		<div className="modal is-active">
			<div className="modal-background" onClick={handleDone} />
			<div className="modal-content">
				<div className="box has-text-left">
					<h3 className="title is-4 has-text-centered">Edit drink</h3>
					<label className="label" htmlFor="edit-date">
						Date
					</label>
					<div className="field">
						<div className="control">
							<input
								type="date"
								className={`input${dateTimeError ? ' is-danger' : ''}`}
								id="edit-date"
								value={date}
								onChange={(event) => {
									const nextDate = event.target.value;
									setDate(nextDate);
									persist(nextDate, time, value);
								}}
							/>
						</div>
					</div>
					<label className="label" htmlFor="edit-time">
						Time
					</label>
					<div className="field">
						<div className="control">
							<input
								type="time"
								className={`input${dateTimeError ? ' is-danger' : ''}`}
								id="edit-time"
								value={time}
								onChange={(event) => {
									const nextTime = event.target.value;
									setTime(nextTime);
									persist(date, nextTime, value);
								}}
							/>
						</div>
						{dateTimeError && (
							<p className="help is-danger">Enter a valid date and time.</p>
						)}
					</div>
					<label className="label" htmlFor="edit-value">
						Standard drinks
					</label>
					<div className="field">
						<div className="control">
							<input
								type="number"
								className={`input${valueError ? ' is-danger' : ''}`}
								id="edit-value"
								value={value}
								onChange={(event) => {
									const raw = event.target.value;
									const nextValue = raw === '' ? '' : _toNumber(raw);
									setValue(nextValue);
									persist(date, time, nextValue);
								}}
							/>
						</div>
						{valueError && (
							<p className="help is-danger">Enter a number greater than 0.</p>
						)}
					</div>
					<button
						className="button is-primary is-fullwidth"
						style={{ marginTop: '1.5rem' }}
						onClick={handleDone}
					>
						Done
					</button>
				</div>
			</div>
			<button className="modal-close is-large" onClick={handleDone} />
		</div>
	);
}
