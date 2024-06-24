/**
 * Setup
 *
 * Shows form to set the user's password and pass code
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-09-20
 */

// Ouroboros modules
import { errors as bodyErrors } from '@ouroboros/body';
import brain, { errors as brainErrors } from '@ouroboros/brain';
import { update } from '@ouroboros/brain-react';
import clone from '@ouroboros/clone';
import { cookies } from '@ouroboros/browser';
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Composite components
import Modal from 'components/elements/Modal';

// Text
import TEXT from 'translations/setup';

// Constants
const STAGE_CHANGE = 0;
const STAGE_SUCCESS = 1;

/**
 * Setup
 *
 * @name Setup
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Setup(props) {

	// State
	const [errors, errorsSet] = useState({});
	const [passwdConfirm, passwdConfirmSet] = useState('');
	const [stage, stageSet] = useState(STAGE_CHANGE);
	const [user, userSet] = useState(false);

	// Hooks
	const location = useLocation();
	const navigate = useNavigate();

	// Location effect
	useEffect(() => {

		// Get the key
		const i = location.pathname.lastIndexOf('/')
		const key = location.pathname.substring(i + 1);

		// Check the key / fetch the data from the server
		brain.read('user/setup', { key }).then(data => {
			if(data) {
				errorsSet({});
				data.key = key;
				userSet(data);
			}
		}, error => {
			if(error.code === bodyErrors.DB_NO_RECORD) {
				errorsSet({ _general: TEXT[props.locale].bad_key});
			}
		});

	}, [location]);

	// Called to update data in the user
	function setField(name, value) {
		userSet(val => {
			let oVal = clone(val);
			oVal[name] = value;
			return oVal;
		});
	}

	// Called to submit the sign in
	function submit() {

		// If the passwords don't match
		if(user.passwd !== passwdConfirm) {
			errorsSet({ passwd_confirm: TEXT[props.locale].no_match });
			return;
		}

		// Add the portal
		user.portal = 'professional';

		// Make the request to the server
		brain.update('user/setup', user).then(data => {
			if(data) {

				// Set the session
				brain.session(data);

				// Store the session in a cookie
				cookies.set('_session', data, 28800);

				// Update the signed in user
				update().then(() => {
					setTimeout(() => {
						navigate('/');
					}, 3000);
				});

				// Set the success stage
				stageSet(STAGE_SUCCESS);
			}
		}, error => {
			if(error.code === bodyErrors.DB_NO_RECORD) {
				errorsSet({ _general: TEXT[props.locale].bad_key });
			} else if(error.code === brainErrors.PASSWORD_STRENGTH) {
				errorsSet({ passwd: TEXT[props.locale].weakpass });
			} else {
				events.get('error').trigger(error);
			}
		});
	}

	// Set locale
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="forgotSubmit" className="padding">
			<Modal open={true}>
				{(stage === STAGE_CHANGE &&
					<div className="change">
						{errors._general &&
							<p className="error">{errors._general}</p>
						}
						<div className="section">
							<p className="title">{_.name_title}</p>
							{user === false ?
								<p>{_.loading}</p>
							:
								<React.Fragment>
									<p><input
										autoComplete="honorific-prefix"
										className="userTitle"
										onChange={ev => setField('title', ev.target.value)}
										placeholder={_.user_title}
										type="text"
										value={user.title || ''}
									/></p>
									{errors.title &&
										<p className="error">{errors.title}</p>
									}
									<p><input
										autoComplete="given-name"
										className="userFirst"
										onChange={ev => setField('first_name', ev.target.value)}
										placeholder={_.user_first}
										type="text"
										value={user.first_name || ''}
									/></p>
									{errors.first_name &&
										<p className="error">{errors.first_name}</p>
									}
									<p><input
										autoComplete="family-name"
										className="userLast"
										onChange={ev => setField('last_name', ev.target.value)}
										placeholder={_.user_last}
										type="text"
										value={user.last_name || ''}
									/></p>
									{errors.last_name &&
										<p className="error">{errors.last_name}</p>
									}
									<p><input
										autoComplete="honorific-suffix"
										className="userSuffix"
										onChange={ev => setField('suffix', ev.target.value)}
										placeholder={_.user_suffix}
										type="text"
										value={user.suffix || ''}
									/></p>
									{errors.suffix &&
										<p className="error">{errors.suffix}</p>
									}
								</React.Fragment>
							}
						</div>
						<div className="section">
							<input
								autoComplete="email"
								type="hidden"
								value={user.email}
							/>
							<p className="title">{_.passwd_title}</p>
							<p><input
								autoComplete="new-password"
								className="userPassword"
								onChange={ev => setField('passwd', ev.target.value)}
								placeholder={_.passwd}
								type="password"
								value={user.passwd || ''}
							/>
							</p>
							{errors.passwd &&
								<p className="error">{errors.passwd}</p>
							}
							<p><input
								autoComplete="new-password"
								className="userPasswordConfirm"
								onChange={ev => passwdConfirmSet(ev.target.value)}
								placeholder={_.passwd_confirm}
								type="password"
								value={passwdConfirm}
							/></p>
							{errors.passwdConfirm &&
								<p className="error">{errors.passwdConfirm}</p>
							}
						</div>

						<div className="flexColumns">
							<div className="flexDynamic center">
								&nbsp;
							</div>
							<div className="flexStatic">
								<button
									className="button"
									type="submit"
									onClick={submit}
								>{_.submit}</button>
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
Setup.propTypes = {
	locale: PropTypes.string.isRequired
}