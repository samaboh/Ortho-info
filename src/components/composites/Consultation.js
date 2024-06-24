/**
 * Consultation
 *
 * Allows a user to consultation the current page they are on
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-25
 */

// Ouroboros modules
import body, { errors } from '@ouroboros/body';
import { useUser } from '@ouroboros/brain-react';
import clone from '@ouroboros/clone';
import events from '@ouroboros/events';
import { pathToTree } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

// Project components
import Upload from 'components/elements/Upload';

// Data
import Data from 'tools/data';

// Constants
import TEXT from 'translations/consultation';

/**
 * Consultation
 *
 * @name Consultation
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Consultation(props) {

	// State
	const [attachment, attachmentSet] = useState(null);
	const [fieldErrors, fieldErrorsSet] = useState({});
	const [insurance, insuranceSet] = useState([]);
	const [name, nameSet] = useState(localStorage.getItem('consultation_name') || '');
	const [notes, notesSet] = useState('');
	const [open, openSet] = useState(false);
	const [passcode, passcodeSet] = useState('');
	const [phoneNumber, phoneNumberSet] = useState(localStorage.getItem('consultation_phone_number') || '');
	const [postalCode, postalCodeSet] = useState(localStorage.getItem('consultation_postal_code') || '');
	const [recaptcha, recaptchaSet] = useState(false);
	const [recaptchaKey, recaptchaKeySet] = useState(false);
	const [sending, sendingSet] = useState(false);
	const [specialist, specialistSet] = useState([]);
	const [lists, listsSet] = useState({
		insurance: null,
		specialists: null
	});

	// Hooks
	const user = useUser();

	// Refs
	const contentRef = useRef(null);
	const recaptchaRef = useRef(null);

	// Load effect
	useEffect(() => {

		// Subscribe to the consultation event
		events.get('consultation').subscribe(openSet);

		// Subscribe to data
		const oD = Data.subscribe(data => {
			listsSet({
				insurance: data.insurance,
				specialists: data.specialists
			});
			recaptchaKeySet(data.recaptcha);
		});

		// Track mouse clicks
		const fMouseDown = (ev) => {
			openSet(val => {
				if(val && contentRef.current && !contentRef.current.contains(ev.target)) {
					return false;
				}
				return val;
			});
		}
		document.addEventListener('mousedown', fMouseDown);

		// Stop tracking mouse clicks
		return () => {
			oD.unsubscribe();
			document.removeEventListener('mousedown', fMouseDown);
		}
	}, []);

	// Called when any of the insurance sliders changes
	function insuranceChange(checked, _id) {
		insuranceSet(l => {
			const lIns = clone(l);
			if(checked) {
				lIns.push(_id);
			} else {
				const i = lIns.indexOf(_id);
				if(i > -1) {
					lIns.splice(i, 1);
				}
			}
			return lIns;
		});
	}

	// Called when the recaptcha changes somehow
	function recaptchaChange(value) {

		// If it reset
		if(value === null) {
			value = false;
		}

		// If we have an error for the recaptcha, and we got a value
		if('recaptcha' in fieldErrors && value) {

			// Remove the error
			fieldErrorsSet(val => {
				const o = clone(val);
				delete o.recaptcha;
				return o;
			});
		}

		// Set the recaptcha
		recaptchaSet(value)
	}

	// Called when any of the specialist sliders changes
	function specialistChange(checked, _id) {
		specialistSet(l => {
			const lSpe = clone(l);
			if(checked) {
				lSpe.push(_id);
			} else {
				const i = lSpe.indexOf(_id);
				if(i > -1) {
					lSpe.splice(i, 1);
				}
			}
			return lSpe;
		});
	}

	// Called when the form is submitted
	function submit() {

		// Init the data to send
		const oData = {
			locale: props.locale,
			name: name,
			notes: notes,
			postal_code: postalCode,
			phone_number: phoneNumber
		}

		// Add things based on whether we have a user or not
		if(user) {
			if(passcode.length !== 4) {
				fieldErrorsSet({ passcode: 'invalid' });
				return;
			}
			oData.passcode = passcode
		} else {
			oData['g-recaptcha-response'] = recaptcha;
		}

		// If we have insurance
		if(insurance.length > 0) {
			oData.insurance_type = insurance;
		}

		// If we have specialists
		if(specialist.length > 0) {
			oData.specialist_type = specialist;
		}

		// If we have an attachment
		if(attachment !== null) {
			oData.attachment = {
				base64: attachment.data,
				filename: attachment.name
			}
		}

		// Show as sending
		sendingSet(true);

		// Send the data
		body.create(
			user ? 'professional' : 'public',
			'referral',
			oData
		).then(data => {

			// Clear errors and fields
			fieldErrorsSet({});
			insuranceSet([]);
			notesSet('');
			specialistSet([]);
			attachmentSet(null);
			if(recaptchaRef.current) {
				recaptchaRef.current.reset();
			}

			// Hide the form
			openSet(false);
			sendingSet(false);

			// Show a message
			events.get('success').trigger(TEXT[props.locale].success);

		}, error => {

			// If we got field errors
			if(error.code === errors.DATA_FIELDS) {
				fieldErrorsSet(pathToTree(error.msg));
			}
			else {
				events.get('error').trigger(error);
			}

		}).finally(() => {

			// If we have a recaptcha, reset it
			if(recaptchaRef.current) {
				recaptchaRef.current.reset();
			}

			// Clear the sending flag
			sendingSet(false);
		});
	}

	// Called when the photo changes
	function uploadChange(upload) {

		// Split the URL
		const lData = upload.url.split(';');

		// Change the data
		attachmentSet({
			data: lData[1].substring(7),
			name: upload.file.name.replace(/ /g, '_'),
			mime: upload.file.type,
			length: upload.file.size,
			type: upload.file.type,
			url: upload.url
		});
	}

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<React.Fragment>
			<div id="consultation_button" onClick={() => openSet(b => !b)}>
				<img
					alt="consultation"
					src={`https://orthoinfo.s3.us-east-1.amazonaws.com/www/request_consultation.${props.locale}.png`}
				/>
			</div>
			{open &&
				<div id="consultation_form">
					<div className="wrapper">
						<div className="content" ref={contentRef}>
							<div className="form">
							<h2>{_.title}</h2>
								<div className="fields">
									<input id="referralLocale" className="form-control" type="hidden" name="locale" value="en-CA" />
									<div>
										<input
											autoComplete={user ? "new-password" : 'name'}
											className="form-control"
											onChange={ev => nameSet(ev.target.value)}
											placeholder={user ? _.patient_name : _.name}
											type="text"
											value={name}
										/>
										{fieldErrors.name &&
											<p className="error">{_.errors[fieldErrors.name]}</p>
										}
									</div>
									<div>
										<input
											autoComplete={user ? "new-password" : 'postal-code'}
											className="form-control"
											onChange={ev => postalCodeSet(ev.target.value)}
											placeholder={_.postal}
											type="text"
											value={postalCode}
										/>
										{fieldErrors.postal_code &&
											<p className="error">{_.errors[fieldErrors.postal_code]}</p>
										}
									</div>
									<div>
										<input
											autoComplete={user ? "new-password" : 'tel'}
											className="form-control"
											onChange={ev => phoneNumberSet(ev.target.value)}
											placeholder={_.phone}
											type="text"
											value={phoneNumber}
										/>
										{fieldErrors.phone_number &&
											<p className="error">{_.errors[fieldErrors.phone_number]}</p>
										}
									</div>
									<div>
										<h2>{_.specialist}:</h2>
										{(lists.specialists === null &&
											<p>Loading...</p>
										) || (
											<React.Fragment>
												{lists.specialists.map(o =>
													<div key={o._id} style={{margin: '5px', display: 'inline-block' }}>
														<input
															checked={specialist.includes(o._id)}
															id={o._id}
															onChange={ev => specialistChange(ev.target.checked, o._id)}
															type="checkbox"
														/>
														<label htmlFor={o._id}>
															&nbsp;{o.name[props.locale]}
														</label>
													</div>
												)}
											</React.Fragment>
										)}
									</div>
									<div>
										<h2>{_.insurance}:</h2>
										{(lists.insurance === null &&
											<p>Loading...</p>
										) || (
											<React.Fragment>
												{lists.insurance.map(o =>
													<div key={o._id} style={{margin: '5px', display: 'inline-block' }}>
														<input
															checked={insurance.includes(o._id)}
															id={o._id}
															onChange={ev => insuranceChange(ev.target.checked, o._id)}
															type="checkbox"
														/>
														<label htmlFor={o._id}>
															&nbsp;{o.name[props.locale]}
														</label>
													</div>
												)}
											</React.Fragment>
										)}
									</div>
									<div>
										<h2>{user ? _.diagnostic : _.notes}:</h2>
										<textarea
											autoComplete="new-password"
											className="form-control"
											maxLength={255}
											onChange={ev => notesSet(ev.target.value)}
											placeholder={user ? _.diagnostic : _.notes}
											value={notes}
										/>
									</div>
									{!user &&
										<div>
											<h2>{_.upload.title}:</h2>
											<Upload
												accept="image/png,image/jpeg,application/pdf"
												maxFileSize={10485760}
												onChange={uploadChange}
												value={attachment}
											>
												{({
													file,
													upload,
													uploadErrors,
													dragProps
												}) => (
													file ? (
														<div className="upload_drop">
															{(file.type === 'image/jpeg' || file.type === 'image/png') ? (
																<div className="upload_photo" style={{backgroundImage: `url(${file.url})`}}>
																	<i className="fas fa-times-circle close" onClick={() => attachmentSet(null)} />
																</div>
															) : (
																<div className="upload_photo">
																	<i className="fas fa-times-circle close" onClick={() => attachmentSet(null)} />
																	<i className="mime fa-solid fa-file-pdf" />
																</div>
															)}
															{fieldErrors.attachment &&
																<p className="error">{fieldErrors.attachment}</p>
															}
														</div>
													) : (
														<React.Fragment>
															<div className="upload_text link" onClick={upload} {...dragProps}>
																<p className="link">
																	{_.upload.drop}<br />
																	{_.upload.max}
																</p>
															</div>
															{uploadErrors &&
																<p className="error">{uploadErrors}</p>
															}
														</React.Fragment>
													)
												)}
											</Upload>
										</div>
									}
								</div>
								{user &&
									<div>
										<h2>{_.passcode}:</h2>
										<input
											autoComplete="new-password"
											className="form-control"
											onChange={ev => passcodeSet(ev.target.value)}
											placeholder={_.passcode}
											type="password"
											value={passcode}
										/>
									</div>
								}
								<div className="buttons">

									{!user && recaptchaKey &&
										<React.Fragment>
											<ReCAPTCHA
												hl={props.locale}
												onChange={recaptchaChange}
												ref={recaptchaRef}
												sitekey={recaptchaKey}
											/>
											{fieldErrors.recaptcha &&
												<p color="red">{fieldErrors.recaptcha.join(', ')}</p>
											}
										</React.Fragment>
									}
									<button type="button" onClick={() => openSet(false)}>{_.cancel}</button>
									{(!sending && (user || recaptcha)) &&
										<button type="submit" onClick={submit}>{_.submit}</button>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			}
		</React.Fragment>
	);
}

// Valid props
Consultation.propTypes = {
	locale: PropTypes.string.isRequired
}