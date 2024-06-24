/**
 * Footer
 *
 * Handles title and menu
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Text
import TEXT from 'translations/footer';

/**
 * Footer
 *
 * Top of the page
 *
 * @name Footer
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Footer(props) {

	// Render
	return (
		<div id="footer" className="flexStatic">
			<p>Copyright 2023 DevMedika Inc. | {TEXT[props.locale].reserved} | {process.env.REACT_APP_VERSION}</p>
		</div>
	);
}

// Valid props
Footer.propTypes = {
	locale: PropTypes.string.isRequired
}