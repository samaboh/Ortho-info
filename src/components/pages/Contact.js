/**
 * Contact
 *
 * Contact Us
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Constants
import TEXT from 'translations/contact';

/**
 * Contact
 *
 * Contact Us
 *
 * @name Contact
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Contact(props) {

	// State
	const [errors, errorsSet] = useState({})

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="contact">
			<h1 className="flex">{_.title}</h1>
			<div className="contact-container container">
				<div className="contact-form">
					<div className="form-title">
						<h3>{_.header}</h3>
						<p style={{ whiteSpace: "pre-line" }}>{_.text}</p>
					</div>
					<form action="">
						<input
							type="text"
							name="first-name"
							placeholder={_.first_name}
						/>
						<input
							type="text"
							name="last-name"
							placeholder={_.last_name}
						/>
						<input
							type="text"
							name="email"
							placeholder={_.email}
						/>
						<input
							type="text"
							name="phone"
							placeholder={_.phone}
						/>
						<input
							type="text"
							name="company"
							placeholder={_.company}
						/>
						<input
							type="text"
							name="subject"
							placeholder={_.subject}
						/>
						<textarea
							name="message"
							placeholder={_.message}
							cols="40"
							rows="10"
						></textarea>
						<button type="submit">{_.submit}</button>
					</form>
				</div>
			</div>
		</div>
	);
}

// Valid props
Contact.propTypes = {
	locale: PropTypes.string.isRequired
};