import React from 'react';

export default function MoreInfoModal({ toggle, children }) {
	return (
		<div className={'modal is-active'}>
			<div className="modal-background" onClick={toggle} />
			<div className="modal-content">
				<div className="box content">{children}</div>
			</div>
			<button className="modal-close is-large" onClick={toggle} />
		</div>
	);
}
