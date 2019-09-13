import _cloneDeep from 'lodash/fp/cloneDeep';
import _orderBy from 'lodash/fp/orderBy';

import addMinutes from 'date-fns/addMinutes';
import dateIsAfter from 'date-fns/isAfter';
import differenceInSeconds from 'date-fns/differenceInSeconds';

export default function currentDrinks({ drinks, now = new Date() }) {
	drinks = _cloneDeep(drinks);
	drinks = _orderBy('time')('asc')(drinks);

	drinks = drinks.map((drink, i) => {
		const { time, value } = drink;
		const nextDrink = drinks[i + 1] || {};

		const requiredMins = value * 60;
		const startTime = drink.startTime || time;
		const finishTime = addMinutes(startTime, requiredMins);

		drink.finishTime = finishTime;

		const nextDrinkDateTime = nextDrink.time || now;
		nextDrink.startTime = dateIsAfter(nextDrinkDateTime, finishTime)
			? nextDrink.time
			: finishTime;

		return drink;
	});

	const result = drinks.reduce((drinks, { value, finishTime }) => {
		const minsRequired = value * 60;
		const timeLeft = differenceInSeconds(finishTime, now) / 60;
		const result =
			timeLeft > minsRequired ? value : timeLeft <= 0 ? 0 : timeLeft / 60;
		return (drinks += result);
	}, 0);
	return result;
}
