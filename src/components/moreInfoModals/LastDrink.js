import React from 'react';
import MoreInfoModal from './MoreInfoModal';

export default function LastDrink({ toggle }) {
	return (
		<MoreInfoModal toggle={toggle}>
			<p>This is more info about last drink.</p>
		</MoreInfoModal>
	);
}
