import React from 'react';
import MoreInfoModal from './MoreInfoModal';

export default function DrinksInYourSystem({ toggle }) {
	return (
		<MoreInfoModal toggle={toggle}>
			<p>This is more info about drinks in your system.</p>
		</MoreInfoModal>
	);
}
