import React from 'react';
import MoreInfoModal from './MoreInfoModal';

export default function DrinksPerHour({ toggle }) {
	return (
		<MoreInfoModal toggle={toggle}>
			<p>This is more info about drinks per hour.</p>
		</MoreInfoModal>
	);
}
