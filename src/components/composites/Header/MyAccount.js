/**
 * My Account
 *
 * View Account details
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-09-21
 */

// Ouroboros modules
import body from '@ouroboros/body';
import { errors as brainErrors } from '@ouroboros/brain';
import { update, useUser } from '@ouroboros/brain-react';
import clone from '@ouroboros/clone';
import events from '@ouroboros/events';
import { pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Project modules
import Locale from 'tools/locale';

// Project data
import LOCALES from 'data/locales';

// Text
import TEXT from 'translations/myaccount';

/**
 * My Account
 *
 * @name MyAccount
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function MyAccount(props) {

	// State
	const [email, emailSet] = useState({email: '', email_passwd: ''});
	const [emailErrors, emailErrorsSet] = useState({});
	const [emailSuccess, emailSuccessSet] = useState(false);
	const [details, detailsSet] = useState({});
	const [detailsErrors, detailsErrorsSet] = useState({});
	const [detailsSuccess, detailsSuccessSet] = useState(false);
	const [passcode, passcodeSet] = useState({passcode: '', passcode_passwd: ''});
	const [passcodeErrors, passcodeErrorsSet] = useState({});
	const [passcodeSuccess, passcodeSuccessSet] = useState(false);
	const [passwd, passwdSet] = useState({confirm: '', passwd: '', new_passwd: ''})
	const [passwdErrors, passwdErrorsSet] = useState({});
	const [passwdSuccess, passwdSuccessSet] = useState(false);

	// Hooks
	const user = useUser();

	// Set locale
	const _ = TEXT[props.locale];

	// Called to update data in one of the states
	function set(callback, name, value) {
		callback(val => {
			let oVal = clone(val);
			oVal[name] = value;
			return oVal;
		});
	}

	// Called to update the user's details
	function detailsSubmit() {

		// Send the data to the server
		body.update('brain', 'user', details).then(data => {

			// If we were successful
			if (data) {

				// Fetch the latest user data
				update();

				// Clear the form
				detailsSet({});

				// Notify of success (and then hide it)
				detailsSuccessSet(true);
				setTimeout(() => detailsSuccessSet(false), 3000);
			}

		}, error => {

			// If we got field errors
			if(error.code === brainErrors.body.DATA_FIELDS) {
				detailsErrorsSet(pathToTree(error.msg));
			}

			// Else, unknown error
			else {
				throw new Error(JSON.stringify(error));
			}
		});
	}

	// Called to update the user's email address
	function emailSubmit() {

		// Clear errors
		emailErrorsSet({});

		// Add the url
		email.url = `https://${window.location.host}/verification/{key}`;

		// Send the new email address to the server
		body.update('brain', 'user/email', email).then(data => {

			// If we were successful
			if (data) {

				// Fetch the latest user data
				update();

				// Reset the form
				emailSet({email: '', email_passwd: ''});

				// Notify of success (and then hide it)
				emailSuccessSet(true);
				setTimeout(() => emailSuccessSet(false), 3000);
			}

		}, error => {

			// If we got field errors
			if(error.code === brainErrors.body.DATA_FIELDS) {
				emailErrorsSet(pathToTree(error.msg))
			}
			// Else, if the email is a duplicate of an existing account
			else if(error.code === brainErrors.body.DB_DUPLICATE) {
				emailErrorsSet({email: _.email_errors.in_use});
			}
			// Else, if the password passed is invalid for the current
			//	account
			else if(error.code === brainErrors.SIGNIN_FAILED) {
				emailErrorsSet({email_passwd: 'password'});
			}
			// Else, unknown error
			else {
				events.get('error').trigger(error);
			}
		});
	}

	// Called to update the user's pass code
	function passcodeSubmit() {

		// Clear errors
		passcodeErrorsSet({});

		// Send the new passcode address to the server
		body.update('professional', 'access/passcode', passcode).then(data => {

			// If we were successful
			if (data) {

				// Reset the form
				passcodeSet({passcode: '', passcode_passwd: ''});

				// Notify of success (and then hide it)
				passcodeSuccessSet(true);
				setTimeout(() => passcodeSuccessSet(false), 3000);
			}

		}, error => {

			// If we got field errors
			if(error.code === brainErrors.body.DATA_FIELDS) {
				passcodeErrorsSet(pathToTree(error.msg))
			}
			// Else, if the password passed is invalid for the current
			//	account
			else if(error.code === brainErrors.SIGNIN_FAILED) {
				passcodeErrorsSet({passcode_passwd: 'password'});
			}
			// Else, unknown error
			else {
				events.get('error').trigger(error);
			}
		});
	}

	// Called to update the user's password
	function passwdSubmit() {

		// Clear errors
		passwdErrorsSet({});

		// If the passwords don't match
		if(passwd.new_passwd !== passwd.confirm) {
			passwdErrorsSet({confirm: 'no_match'});
			return;
		}

		// Submit the new password
		body.update('brain', 'user/passwd', {
			new_passwd: passwd.new_passwd,
			passwd: passwd.passwd
		}).then(data => {

			// If we were successful
			if (data) {

				// Reset the form
				passwdSet({confirm: '', passwd: '', new_passwd: ''});

				// Notify of success (and then hide it)
				passwdSuccessSet(true);
				setTimeout(() => passwdSuccessSet(false), 3000);
			}

		}, error => {

			// If we got field errors
			if(error.code === brainErrors.body.DATA_FIELDS) {
				passwdErrorsSet(pathToTree(error.msg));
			}
			// Else, if the new password isn't strong enough
			else if (error.code === brainErrors.PASSWORD_STRENGTH) {
				passwdErrorsSet({new_passwd: 'strength'});
			}
			// Else, unknown error
			else {
				events.get('error').trigger(error);
			}
		});
	}

	// If we have no user
	if(!user) {
		return null;
	}

	// Render
	return (
		<div id="myAccount">
			<div className="section">
				<p className="title">{_.locale_header}</p>
				<p>
					<select
						onChange={ev => Locale.set(ev.target.value)}
						value={user.locale}
					>
						{LOCALES.list.map(l =>
							<option key={l[0]} value={l[0]}>{l[2][props.locale]}</option>
						)}
					</select>
				</p>
			</div>

			<div className="section">
				<p className="title">{_.passcode_header}</p>
				<div>
					<input
						autoComplete="new-password"
						onChange={ev => set(passcodeSet, 'passcode', ev.target.value)}
						placeholder={_.passcode_new}
						type="password"
						value={passcode.passcode}
					/>
					{passcodeErrors.passcode &&
						<p className="error">{_.passcode_errors[passcodeErrors.passcode]}</p>
					}
				</div>
				<div>
					<input
						autoComplete="current-password"
						onChange={ev => set(passcodeSet, 'passcode_passwd', ev.target.value)}
						placeholder={_.passcode_passwd}
						type="password"
						value={passcode.passcode_passwd}
					/>
					{passcodeErrors.passcode_passwd &&
						<p className="error">{_.passcode_errors[passcodeErrors.passcode_passwd]}</p>
					}
				</div>
				{passcodeSuccess &&
					<div>{_.passcode_success}</div>
				}
				<div className="buttons">
					<button
						className="button"
						type="submit"
						onClick={passcodeSubmit}
					>
						{_.passcode_submit}
					</button>
				</div>
			</div>

			<div className="section">
				<p className="title">{_.email_header}</p>
				<p>{_.email_current}: <b>{user.email}</b></p>
				<div>
					<input
						autoComplete="email"
						onChange={ev => set(emailSet, 'email', ev.target.value)}
						placeholder={_.email_new}
						type="text"
						value={email.email}
					/>
					{emailErrors.email &&
						<p className="error">{_.email_errors[emailErrors.email]}</p>
					}
				</div>
				<div>
					<input
						autoComplete="current-password"
						onChange={ev => set(emailSet, 'email_passwd', ev.target.value)}
						placeholder={_.email_passwd}
						type="password"
						value={email.email_passwd}
					/>
					{emailErrors.email_passwd &&
						<p className="error">{_.email_errors[emailErrors.email_passwd]}</p>
					}
				</div>
				{emailSuccess &&
					<div>{_.email_success}</div>
				}
				<div className="buttons">
					<button
						className="button"
						type="submit"
						onClick={emailSubmit}
					>
						{_.email_submit}
					</button>
				</div>
			</div>

			<div className="section">
				<p className="title">{_.details_header}</p>
				<div>
					<input
						autoComplete="honorific-prefix"
						className="details_title"
						onChange={ev => set(detailsSet, 'title', ev.target.value)}
						placeholder={_.details_title}
						type="text"
						value={'title' in details ? details.title : (user.title || '')}
					/>
					{detailsErrors.title &&
						<p className="error">{_.details_errors[detailsErrors.title]}</p>
					}
					<input
						autoComplete="given-name"
						className="details_first"
						onChange={ev => set(detailsSet, 'first_name', ev.target.value)}
						placeholder={_.details_first}
						type="text"
						value={'first_name' in details ? details.first_name : (user.first_name || '')}
					/>
					{detailsErrors.first_name &&
						<p className="error">{_.details_errors[detailsErrors.first_name]}</p>
					}
					<input
						autoComplete="family-name"
						className="details_last"
						onChange={ev => set(detailsSet, 'last_name', ev.target.value)}
						placeholder={_.details_last}
						type="text"
						value={'last_name' in details ? details.last_name : (user.last_name || '')}
					/>
					{detailsErrors.last_name &&
						<p className="error">{_.details_errors[detailsErrors.last_name]}</p>
					}
					<input
						autoComplete="honorific-suffix"
						className="details_suffix"
						onChange={ev => set(detailsSet, 'suffix', ev.target.value)}
						placeholder={_.details_suffix}
						type="text"
						value={'suffix' in details ? details.suffix : (user.suffix || '')}
					/>
					{detailsErrors.suffix &&
						<p className="error">{_.details_errors[detailsErrors.suffix]}</p>
					}
				</div>
				<div>
					<input
						autoComplete="tel"
						className="details_phone"
						onChange={ev => set(detailsSet, 'phone_number', ev.target.value)}
						placeholder={_.details_phone}
						type="tel"
						value={'phone_number' in details ? details.phone_number : (user.phone_number || '')}
					/>
					{detailsErrors.phone_number &&
						<p className="error">{_.details_errors[detailsErrors.phone_number]}</p>
					}
					<input
						autoComplete="tel-extension"
						className="details_extension"
						onChange={ev => set(detailsSet, 'phone_ext', ev.target.value)}
						placeholder={_.details_ext}
						type="text"
						value={'phone_ext' in details ? details.phone_ext : (user.phone_ext || '')}
					/>
					{detailsErrors.phone_ext &&
						<p className="error">{_.details_errors[detailsErrors.phone_ext]}</p>
					}
				</div>
				{detailsSuccess &&
					<div>{_.details_success}</div>
				}
				<div className="buttons">
					<button
						className="button"
						type="submit"
						onClick={detailsSubmit}
					>
						{_.details_submit}
					</button>
				</div>
			</div>

			<div className="section">
				<p className="title">{_.passwd_header}</p>
				<div>
					<input
						autoComplete="current-password"
						onChange={ev => set(passwdSet, 'passwd', ev.target.value)}
						placeholder={_.passwd_current}
						type="password"
						value={passwd.passwd}
					/>
					{passwdErrors.passwd &&
						<p className="error">{_.passwd_errors[passwdErrors.passwd]}</p>
					}
				</div>
				<div>
					<input
						autoComplete="new-password"
						onChange={ev => set(passwdSet, 'new_passwd', ev.target.value)}
						placeholder={_.passwd_new}
						type="password"
						value={passwd.new_passwd}
					/>
					{passwdErrors.new_passwd &&
						<p className="error">{_.passwd_errors[passwdErrors.new_passwd]}</p>
					}
					<input
						autoComplete="new-password"
						onChange={ev => set(passwdSet, 'confirm', ev.target.value)}
						placeholder={_.passwd_confirm}
						type="password"
						value={passwd.confirm}
					/>
					{passwdErrors.confirm &&
						<p className="error">{_.passwd_errors[passwdErrors.confirm]}</p>
					}
				</div>
				{passwdSuccess &&
					<div>{_.passwd_success}</div>
				}
				<div className="buttons">
					<button
						className="button"
						type="submit"
						onClick={passwdSubmit}
					>
						{_.passwd_submit}
					</button>
				</div>
			</div>
		</div>
	)
}

// Valid props
MyAccount.propTypes = {
	locale: PropTypes.string.isRequired
}