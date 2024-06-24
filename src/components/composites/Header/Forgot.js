/**
 * Forgot
 *
 * Request an email to change your password
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-09-19
 */

// Ouroboros modules
import { errors as bodyErrors } from '@ouroboros/body';
import brain from '@ouroboros/brain';
import events from '@ouroboros/events';
import { pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Constants
const STAGE_REQUEST = 0;
const STAGE_SUCCESS = 1;
const TEXT = {
	'en-CA': {
		'email': 'E-Mail Address',
		'return': 'Return',
		'submit': 'Request',
		'success': 'We have been notified of your request. If your email address is found in the system you will soon get an email with instructions on how to change your password.'
	},
	'fr-CA': {
		'email': 'Adresse E-Mail',
		'return': 'Revenir',
		'submit': 'Demande',
		'success': 'Nous avons été informés de votre demande. Si votre adresse e-mail est trouvée dans le système, vous recevrez bientôt un e-mail avec des instructions sur la façon de changer votre mot de passe.'
	}
};

/**
 * Forgot Request
 *
 * @name ForgotRequest
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function ForgotRequest(props) {

	// State
	const [email, emailSet] = useState('');
	const [errors, errorsSet] = useState({});
	const [stage, stageSet] = useState(STAGE_REQUEST)

	// Called to submit the sign in
	function submit() {

		// Send the forgot password request
		brain.create('user/passwd/forgot', {
			email,
			url: `https://${window.location.host}/forgot/{key}`
		}).then(data => {

			// Change the stage
			stageSet(STAGE_SUCCESS);

		}, error => {

			// If we got field errors
			if(error.code === bodyErrors.DATA_FIELDS) {
				errorsSet(pathToTree(error.msg));
			}

			// Else, unknown error
			else {
				events.get('error').trigger(error);
			}
		});
	}

	// Set locale
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="forgotRequest">
			{(stage === STAGE_REQUEST &&
				<div className="request">
					<p>
						{_.email}<br />
						<input
							onChange={(ev) => emailSet(ev.target.value)}
							type="text"
							value={email}
						/>
					</p>
					{errors.email &&
						<p className="error">{errors.email}</p>
					}
					<div className="flexColumns">
						<div className="flexDynamic center">
							<p className="link" onClick={() => props.onChange('signin') } >
								<i className="fa-solid fa-angle-left" />
								&nbsp;{_.return}
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
			) || (stage === STAGE_SUCCESS &&
				<div className="success">
					<p>{_.success}</p>
					<p className="link" onClick={() => props.onChange('signin') } >
						<i className="fa-solid fa-angle-left" />
						&nbsp;{_.return}
					</p>
				</div>
			)}
		</div>
	)
}

// Valid props
ForgotRequest.propTypes = {
	locale: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
}