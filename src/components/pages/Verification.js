/**
 * Verification
 *
 * Verification page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-10-05
 */

// Ouroboros modules
import brain, { errors } from '@ouroboros/brain';
import events from '@ouroboros/events';
import Modal from 'components/elements/Modal';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Text
import TEXT from 'translations/verification';

/**
 * Verification
 *
 * Handles verifying the email and reporting success/failure
 *
 * @name Verification
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Verification(props) {

	// State
	const [msg, msgSet] = useState({ type: '', content: 'checking' });

	// Hooks
	const { key } = useParams();
	const navigate = useNavigate();

	// Load effect
	useEffect(() => {

		// Send the key to the server to verify
		brain.update('user/email/verify', {
			key
		}).then(data => {
			if(data) {
				msgSet({ type: 'success', content: 'success' });
			}
		}, error => {
			if(error.code === errors.body.DB_NO_RECORD) {
				msgSet({ type: 'error', content: 'failed' });
			} else {
				events.get('error').trigger(error);
			}
		}).finally(() =>
			setTimeout(() =>
				navigate('/')
				, 3000
			)
		);

	}, [key]);

	// Render
	return (
		<Modal open={true}>
			<div className={msg.type}>
				<p>{TEXT[props.locale][msg.content]}</p>
			</div>
		</Modal>
	);
}

// Valid props
Verification.propTypes = {
	locale: PropTypes.string.isRequired
}