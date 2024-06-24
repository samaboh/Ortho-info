/**
 * Sign Up Form
 *
 * Shows the actual form to enter signup details and request access
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-09-19
 */

// Ouroboros modules
import body, { errors as bodyErrors } from '@ouroboros/body';
import events from '@ouroboros/events';
import { omap, pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Text
import TEXT from 'translations/signup';

// Constants
const STAGE_REQUEST = 0;
const STAGE_VERIFICATION = 1;
const STAGE_SUCCESS = 2;

/**
 * SignUp
 *
 * @name SignUp
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function SignUp(props) {

	// State
	const [code, codeSet] = useState('');
	const [comm, commSet] = useState('email');
	const [email, emailSet] = useState('');
	const [errors, errorsSet] = useState({});
	const [license_number, license_numberSet] = useState('');
	const [mobile_number, mobile_numberSet] = useState('+1');
	const [name, nameSet] = useState('');
	const [stage, stageSet] = useState(0);
	const [type, typeSet] = useState('doctor');

	// Called to make the signup request
	function request() {

		// Clear the errors
		errorsSet({});

		// Send the request to the server to start the process
		body.create('professional', 'request', { 'record': {
			name, type, email, mobile_number, license_number,
			locale: props.locale,
			verification_type: comm
		}}).then(data => {

			// If the user already existed
			if(data === true) {
				stageSet(STAGE_SUCCESS);
			} else if(data === 'requires_verification') {
				stageSet(STAGE_VERIFICATION);
			}

		}, error => {
			if(error.code === bodyErrors.DATA_FIELDS) {
				errorsSet(pathToTree(error.msg).record);
			} else if(error.code === bodyErrors.DB_DUPLICATE) {
				errorsSet({ email: 'duplicate' });
			} else {
				events.get('error').trigger(error);
			}
		});
	}

	// Called to verify the existing request
	function verify() {

		// Clear the errors
		errorsSet({});

		// Send the verification code to the server
		body.update('professional', 'request/verify', {
			code
		}).then(data => {
			if(data) {
				stageSet(STAGE_SUCCESS);
			}
		}, error => {
			if(error.code === bodyErrors.DATA_FIELDS) {
				errorsSet(pathToTree(error.msg));
			} else {
				events.get('error').trigger(error);
			}
		});
	}

	// Set locale
	const _ = TEXT[props.locale]

	// Render
	return (
		<div className="signup">
			{(stage === STAGE_REQUEST &&
				<div className="request">
					<p>
						{_.name}<br />
						<input
							onChange={(ev) => nameSet(ev.target.value)}
							type="text"
							value={name}
						/>
					</p>
					{errors.name &&
						<p className="error">{_.errors[errors.name]}</p>
					}
					<p>
						{_.type}<br />
						<select
							onChange={(ev) => typeSet(ev.target.value)}
							value={type}
						>
							{omap(_.types, (v, k, i) =>
								<option key={k} value={k}>{v}</option>
							)}
						</select>
					</p>
					{errors.type &&
						<p className="error">{_.errors[errors.type]}</p>
					}
					<p>
						{_.license}<br />
						<input
							onChange={(ev) => license_numberSet(ev.target.value)}
							type="text"
							value={license_number}
						/>
					</p>
					{errors.license_number &&
						<p className="error">{_.errors[errors.license_number]}</p>
					}
					<p>
						{_.email}<br />
						<input
							onChange={(ev) => emailSet(ev.target.value)}
							type="text"
							value={email}
						/>
					</p>
					{errors.email &&
						<p className="error">{_.errors[errors.email]}</p>
					}
					<p>
						{_.number}<br />
						<input
							onChange={(ev) => mobile_numberSet(ev.target.value)}
							type="text"
							value={mobile_number}
						/>
					</p>
					{errors.mobile_number &&
						<p className="error">{_.errors[errors.mobile_number]}</p>
					}
					<p>{_.comm}</p>
					<p>
						<label htmlFor="signup_comm_email">
							<input
								checked={comm === 'email'}
								id="signup_comm_email"
								onChange={() => commSet('email')}
								type="radio"
								value="email"
							/>
							&nbsp;{_.comm_email}
						</label>
						<label htmlFor="signup_comm_sms">
							<input
								checked={comm === 'sms'}
								id="signup_comm_sms"
								onChange={() => commSet('sms')}
								type="radio"
								value="sms"
							/>
							&nbsp;{_.comm_sms}
						</label>
					</p>
					<div className="flexColumns">
						<div className="flexDynamic center">
							<p className="link flexDynamic" onClick={() => props.onChange('signin') } >
								{_.cancel}
							</p>
						</div>
						<div className="flexStatic">
							<button
								className="button"
								onClick={request}
								type="submit"
							>{_.submit}</button>
						</div>
					</div>
				</div>
			) || (stage === STAGE_VERIFICATION &&
				<div className="verification">
					<p>
						{_.submitted[comm]}<br />
						<input
							onChange={(ev) => codeSet(ev.target.value)}
							type="text"
							value={code}
						/>
					</p>
					<div className="flexColumns">
						<div className="flexDynamic center">
							<p className="link flexDynamic" onClick={() => props.onChange('signin') } >
								{_.cancel}
							</p>
						</div>
						<div className="flexStatic">
							<button
								className="button"
								onClick={verify}
								type="submit"
							>{_.submit}</button>
						</div>
					</div>
				</div>
			) || (stage === STAGE_SUCCESS &&
				<div className="success">
					<p>{_.success}</p>
					<p className="link" onClick={() => props.onChange('signin') } >
						{_.signin}
					</p>
				</div>
			)}
		</div>
	);
}

// Valid props
SignUp.propTypes = {
	locale: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
}