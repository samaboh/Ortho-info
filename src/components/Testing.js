/**
 * Testing
 *
 * Shows a testing component with site info
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-19
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Project modules
import Locale from 'tools/locale';

// Project hooks
import { useWidth } from 'hooks/width';

// Project data
import LOCALES from 'data/locales';

/**
 * Testing
 *
 * @name Testing
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Testing(props) {

	// State
	const [display, displaySet] = useState('closed');

	// Hooks
	const location = useLocation();
	const width = useWidth();

	// If it's closed
	if(display === 'closed') {
		return (
			<div id="testing" className="closed">
				<button onClick={() => displaySet('open')}>T</button>
			</div>
		);
	}

	// Render
	return (
		<div id="testing" className="open">
			<button onClick={() => displaySet('closed')}>X</button>
			<p>Version: {process.env.REACT_APP_VERSION}</p>
			<p>Location: {location.pathname}</p>
			<p>Width: {width}</p>
			<p>Locale: {props.locale}</p>
			<p>Options: {LOCALES.list.map(l =>
					l[0] === props.locale ? null :
					<span key={l[0]} className="link" title={l[2][l[0]]} onClick={() => Locale.set(l[0])}>{l[0]} </span>
				)}
			</p>
		</div>
	)
}

// Valid props
Testing.propTypes = {
	locale: PropTypes.string.isRequired
}