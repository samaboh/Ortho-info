/**
 * Referral Attachment URL
 *
 * Manages a signed URL to a referral attachment
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-02-27
 */

// Ouroboros modules
import body from '@ouroboros/body';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

/**
 * Referral Attachment URL
 *
 * Used to generate a signed URL for the attachment
 *
 * @name ReferralAttachmentURL
 * @access private
 * @param {object} props Properties passed to the component
 * @returns React.Component
 */
export default function ReferralAttachmentURL(props) {

	// State
	const [url, urlSet] = useState(false);

	// Refs
	const refTimer = useRef(0);

	// Load effect
	useEffect(() => {
		return () => {
			if(refTimer.current) {
				clearTimeout(refTimer.current);
			}
		}
	}, []);

	// Called to fetch the url
	function fetch() {

		// Send the request to the server
		body.read('professional', 'referral/attachment', {
			_id: props.value
		}).then(data => {

			// If we got a url
			if(data) {

				// Set it and open it
				urlSet(data);
				window.open(data, '_blank');
			}

			// Expire after 59 minutes
			refTimer.current = setTimeout(() => {
				urlSet(false);
			}, 3540000);
		});
	}

	// Render
	return (
		<span>
			{url === false ?
				<span className="link" onClick={fetch}>
					<i className="fa-solid fa-up-right-from-square agreed" />
				</span>
			:
				<a href={url} target="_blank" rel="noreferrer">
					<i className="fa-solid fa-up-right-from-square agreed" />
				</a>
			}
		</span>
	);
}

// Valid props
ReferralAttachmentURL.validProps = {
	text: PropTypes.exact({
		initial: PropTypes.any.isRequired,
		generating: PropTypes.any.isRequired,
		done: PropTypes.any.isRequired
	}).isRequired,
	value: PropTypes.string.isRequired
}