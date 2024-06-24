/**
 * Passcode
 *
 * Allows a professional to set their passcode
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-10-05
 */

// Ouroboros modules
import body, { errors as bodyErrors } from '@ouroboros/body';
import events from '@ouroboros/events';
import { pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Text
import TEXT from 'translations/passcode';

/**
 * Passcode
 *
 * @name Passcode
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Passcode(props) {

	// State
	const [confirm, confirmSet] = useState('');
	const [errors, errorsSet] = useState({});
	const [passcode, passcodeSet] = useState('');

	// Called to submit the signature
	function submit() {

		// Clear errors
		errorsSet({});

		// If the passcodes don't match
		if(passcode !== confirm) {
			errorsSet({ confirm: 'no_match' });
			return;
		}

		// Send the encoded image to the server
		body.update('professional', 'access/passcode', {
			passcode
		}).then(data => {
			if(data) {
				props.onStored();
			}
		}, error => {
			if(error.code === bodyErrors.DATA_FIELDS) {
				errorsSet(pathToTree(error.msg));
			} else {
				events.get('error').trigger(error);
			}
		});
	}

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div className="section">
			<h2>{_.title}</h2>
			<p className="accessCode"><input
				autoComplete="new-password"
				onChange={ev => passcodeSet(ev.target.value)}
				placeholder={_.passcode}
				type="password"
				value={passcode}
			/></p>
			{errors.passcode &&
				<p className="error right">{_.errors[errors.passcode]}</p>
			}
			<p className="accessCode"><input
				autoComplete="new-password"
				onChange={ev => confirmSet(ev.target.value)}
				placeholder={_.confirm}
				type="password"
				value={confirm}
			/></p>
			{errors.confirm &&
				<p className="error right">{_.errors[errors.confirm]}</p>
			}
			<div className="buttons">
				<button
					className="button"
					type="submit"
					onClick={submit}
				>
					{_.submit}
				</button>
			</div>
		</div>
	);
}

// Valid props
Passcode.propTypes = {
	locale: PropTypes.string.isRequired,
	onStored: PropTypes.func.isRequired
}