/**
 * Sign In Form
 *
 * Shows the actual form to enter email and password
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-09-19
 */

// Ouroboros modules
import { errors as bodyErrors } from '@ouroboros/body';
import { errors as brainErrors } from '@ouroboros/brain';
import { signin } from '@ouroboros/brain-react';
import { cookies } from '@ouroboros/browser';
import events from '@ouroboros/events';
import { pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Project modules
import Locale from 'tools/locale';

// Constants
import TEXT from 'translations/signin';

/**
 * SignIn
 *
 * @name SignIn
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function SignIn(props) {

	// State
	const [email, emailSet] = useState('');
	const [errors, errorsSet] = useState({});
	const [passwd, passwdSet] = useState('');

	// Called on every key press to see if someone pressed the enter key
	function checkEnter(ev) {
		if(ev.key === 'Enter') {
			submit();
		}
	}

	// Called to submit the sign in
	function submit() {

		// Try to sign into the server
		signin({ email, passwd, portal: 'professional' }).then(data => {

			// Welcome the user
			events.get('success').trigger(
				`${TEXT[props.locale]} ${data.user.first_name}`
			);

			// Store the session in a cookie
			cookies.set('_session', data.session, 28800);

			// If the current local doesn't match the user's preferred
			if(data.user.locale !== Locale.get()) {
				Locale.set(data.user.locale);
			}

			// Hide sign in
			props.onChange(false);

		}, error => {

			// If we got field errors
			if(error.code === bodyErrors.DATA_FIELDS) {
				errorsSet(pathToTree(error.msg));
			}

			// Else, if the signin itself failed
			else if(error.code === brainErrors.SIGNIN_FAILED) {
				errorsSet({email: TEXT[props.locale].error});
			}

			else if(error.code === brainErrors.BAD_PORTAL) {
				errorsSet({email: TEXT[props.locale].bad_portal})
			}

			// Else, unknown error
			else {
				events.get('error').trigger(error)
			}
		});
	}

	// Set locale
	const _ = TEXT[props.locale]

	// Render
	return (
		<div className="signin">
			<p>
				{_.email}<br />
				<input
					onChange={(ev) => emailSet(ev.target.value)}
					onKeyDown={checkEnter}
					type="text"
					value={email}
				/>
			</p>
			{errors.email &&
				<p className="error">{errors.email}</p>
			}
			<p>
				{_.passwd}<br />
				<input
					onChange={(ev) => passwdSet(ev.target.value)}
					onKeyDown={checkEnter}
					type="password"
					value={passwd}
				/>
			</p>
			{errors.passwd &&
				<p className="error">{errors.passwd}</p>
			}
			<div className="flexColumns flex">
				<div className="flexDynamic flexColumns center sign-up">
					<p className="link flexDynamic" onClick={() => props.onChange('forgot') } >
						{_.forgot}
					</p>
					<p className="link flexDynamic" onClick={() => props.onChange('signup') } >
						{_.signup}
					</p>
				</div>
				<div className="flexStatic">
					<button
						className="button"
						onClick={submit}
						type="submit"
					>{_.submit}</button>
				</div>
			</div>
		</div>
	)
}

// Valid props
SignIn.propTypes = {
	locale: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
}