import React from 'react';

export default function Help({ toggle }) {
	return (
		<div className={`modal is-active`}>
			<div className="modal-background" onClick={toggle} />
			<div className="modal-content">
				<div className="box content">
					<h1>Terms of Service</h1>
					<p>
						By accessing and using this service, you accept and agree to be
						bound by the terms and provision of this agreement. In addition,
						when using these particular services, you shall be subject to any
						posted guidelines or rules applicable to such services. Any
						participation in this service will constitute acceptance of this
						agreement. If you do not agree to abide by the above, please do not
						use this service.
					</p>
					<p>
						This site and its components are offered for informational purposes
						only; this site shall not be responsible or liable for the accuracy,
						usefulness or availability of any information transmitted or made
						available via the site, and shall not be responsible or liable for
						any error or omissions in that information.
					</p>
					<p>
						The Site and its original content, features, and functionality are
						owned by Tyler Weeres and are protected by international copyright,
						trademark, patent, trade secret, and other intellectual property or
						proprietary rights laws.
					</p>
					<p>
						Drinktracker reserves the right to change these conditions from time
						to time as it sees fit and your continued use of the site will
						signify your acceptance of any adjustment to these terms.You are
						therefore advised to re-read this statement on a regular basis.
					</p>
				</div>
			</div>
			<button className="modal-close is-large" onClick={toggle} />
		</div>
	);
}
