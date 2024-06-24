/**
 * Forgot
 *
 * Shows form to change the user's password
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-09-20
 */

// Ouroboros modules
import brain, { errors } from '@ouroboros/brain';
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Composite components
import Modal from 'components/elements/Modal';

// Text
import TEXT from 'translations/forgot';

// Constants
const STAGE_CHANGE = 0;
const STAGE_SUCCESS = 1;

/**
 * Forgot
 *
 * @name Forgot
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Forgot(props) {

	// State
	const [confirm, confirmSet] = useState('');
	const [error, errorSet] = useState(false);
	const [passwd, passwdSet] = useState('');
	const [stage, stageSet] = useState(STAGE_CHANGE);

	// Hooks
	const location = useLocation();
	const navigate = useNavigate();

	// Called to submit the sign in
	function submit() {

		// Get the key
		const i = location.pathname.lastIndexOf('/')
		const key = location.pathname.substring(i + 1);

		// If the passwords don't match
		if(passwd !== confirm) {
			errorSet(TEXT[props.locale].nomatch);
			return;
		}

		// Make the request to the server
		brain.update('user/passwd/forgot', {
			key, passwd
		}).then(data => {
			if(data) {
				stageSet(STAGE_SUCCESS);
			}
		}, error => {
			if(error.code === errors.body.DB_NO_RECORD) {
				errorSet(TEXT[props.locale].badkey);
			} else if(error.code === errors.PASSWORD_STRENGTH) {
				errorSet(TEXT[props.locale].weakpass)
			} else {
				errorSet(JSON.stringify(error, null, 4));
			}
		});
	}

	// Set locale
	const _ = TEXT[props.locale]

	// Render
	return (
		<div id="forgotSubmit" className="padding">
			<Modal open={true}>
				{(stage === STAGE_CHANGE &&
					<div className="change">
						{error &&
							<div className="error">{error}</div>
						}
						<p>
							{_.passwd}<br />
							<input
								onChange={(ev) => passwdSet(ev.target.value)}
								type="password"
								value={passwd}
							/>
						</p>
						<p>
							{_.confirm}<br />
							<input
								onChange={(ev) => confirmSet(ev.target.value)}
								type="password"
								value={confirm}
							/>
						</p>
						<div className="flexColumns">
							<div className="flexDynamic center">
								&nbsp;
							</div>
							<div className="flexStatic">
								<input
									onClick={submit}
									type="button"
									value={_.submit}
								/>
							</div>
						</div>
					</div>
				) || (stage === STAGE_SUCCESS &&
					<div className="success">
						<p>{_.success}</p>
						<p className="link" onClick={() => {
							events.get('signin_show').trigger();
							navigate('/');
						}}>{_.return}</p>
					</div>
				)}
			</Modal>
		</div>
	);
}

// Valid props
Forgot.propTypes = {
	locale: PropTypes.string.isRequired
}