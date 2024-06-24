/**
 * Loading
 *
 * Shows a loading image/text/whatever
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Text
const TEXT = {
	'en-CA': 'Loading',
	'fr-CA': 'Chargement'
};

/**
 * Loading
 *
 * @name Loading
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Loading(props) {
	return (
        <div id="loading">
            <i className="fa-solid fa-circle-notch fa-spin fa-xl"></i>
            <p>{TEXT[props.locale]}...</p>
        </div>
    );
}

// Valid props
Loading.propTypes = {
	locale: PropTypes.string.isRequired
}