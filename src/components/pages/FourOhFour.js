/**
 * 404
 *
 * Shows a 404 page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';
import { useLocation } from 'react-router';

// Text
import TEXT from 'translations/fourohfour';

/**
 * FourOhFour
 *
 * @name FourOhFour
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function FourOhFour(props) {

	// Get the location
	const location = useLocation();

	// Text
	const _ = TEXT[props.locale];

	// Render location
	return (
		<div id="_404">
			<h1>{_.title}</h1>
			<p>{_.descr.replace('%URL%', location.pathname)}.</p>
		</div>
	);
}

// Valid props
FourOhFour.propTypes = {
	locale: PropTypes.string.isRequired
}