/**
 * Share
 *
 * Allows a user to share the current page they are on
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-25
 */

// Ouroboros modules
import body from '@ouroboros/body';
import { useUser } from '@ouroboros/brain-react';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Constants
import TEXT from 'translations/share';

/**
 * Share
 *
 * @name Share
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Share(props) {

	// State
	const [name, nameSet] = useState('');
	const [open, openSet] = useState(false);
	const [sender, senderSet] = useState(localStorage.getItem('sharing_sender') || '');
	const [sending, sendingSet] = useState(false);
	const [to, toSet] = useState('');
	const [type, typeSet] = useState(localStorage.getItem('sharing_type') || 'email');

	// Hooks
	const location = useLocation();
	const user = useUser();

	// Refs
	const contentRef = useRef(null);

	// Load effect
	useEffect(() => {

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
			document.removeEventListener('mousedown', fMouseDown);
		}
	}, []);

	// Called when the form is submitted
	function submit() {

		// Init the data to send
		const oData = {
			title: document.title,
			url: window.location.href,
			locale: props.locale,
			[type]: to
		}

		// If we have a sender
		if(sender.trim() !== '') {

			// Add it to the request data
			oData.sender = sender;

			// set it in local storage
			localStorage.setItem('sharing_sender', sender);
		}

		// If we have a patient name
		if(name.trim() !== '') {

			// Add it to the request data
			oData.name = name;
		}

		// Store the type
		localStorage.setItem('sharing_type', type);

		// Show as sending
		sendingSet(true);

		// Send the request to the public service
		body.create('public', 'share', oData).then(data => {

			// Clear fields
			toSet('');

			// Hide the form
			openSet(false);
			alert('sent');
		}, error => {
			alert('failed!');
		}).finally(() => sendingSet(false));
	}

	// If we are not on a condition, don't render anything
	if(location.pathname.substring(0, 11) !== '/condition/') {
		return null;
	}

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<React.Fragment>
			<div  id="share_button" onClick={() => openSet(b => !b)} >
				<img
					alt="share"
					src={`https://orthoinfo.s3.us-east-1.amazonaws.com/www/share.${props.locale}.png`}
				/>
			</div>
			{open &&
				<div id="share_form">
					<div className="wrapper">
						<div className="content" ref={contentRef}>
							<h2>{_.title}</h2>
							<div className="form">
								<div className="fields">
									{!user &&
										<div>
											<input
												className="form-control"
												onChange={ev => senderSet(ev.target.value)}
												placeholder={_.sender}
												type="text"
												value={sender}
											/>
										</div>
									}
									<div>
										<input
											className="form-control"
											onChange={ev => nameSet(ev.target.value)}
											placeholder={user ? _.patient : _.name}
											type="text"
											value={name}
										/>
									</div>
									<div>
										<h2>{_.sendby}:</h2>
										<input
											type="radio"
											name="type"
											onChange={() => typeSet('email')}
											value="email"
											checked={type === 'email'}
										/>
										<label htmlFor="sharingTypeEmail" onClick={() => typeSet('email')}>{_.email}</label>
										<input
											type="radio"
											name="type"
											onChange={() => typeSet('phone_number')}
											value="phone_number"
											checked={type === 'phone_number'}
										/>
										<label htmlFor="sharingTypeSMS" onClick={() => typeSet('phone_number')}>{_.sms}</label>
									</div>
									<div>
										<input
											className="form-control"
											type="text"
											onChange={ev => toSet(ev.target.value)}
											placeholder={_.to[type]}
											value={to}
										/>
									</div>
								</div>
								<div className="buttons">
									<button type="button" onClick={() => openSet(false)}>{_.cancel}</button>
									<button disabled={sending} type="submit" onClick={submit}>{_.submit}</button>
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
Share.propTypes = {
	locale: PropTypes.string.isRequired
}