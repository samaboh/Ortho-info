/**
 * Video Player
 *
 * Generates the necessary embed code to display a video based on type, id, and
 * other options
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-04-30
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Local components
import YouTube from './YouTube.js';

// Constants
const COMPONENTS = {
	youtube: YouTube
}

/**
 * Video Player
 *
 * Displays a player for the video or list of videos that needs to be displayed
 *
 * @name VideoPlayer
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function VideoPlayer(props) {

	// Use the source to get the child component
	const Component = COMPONENTS[props.value.source];

	// Render the component by passing along all passed props
	return (
		<Component
			size={props.size}
			value={props.value.id}
		/>
	);
}

// Valid props
VideoPlayer.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
	value: PropTypes.exact({
		id: PropTypes.any.isRequired,
		source: PropTypes.oneOf(['youtube']).isRequired
	})
}

// Default props
VideoPlayer.defaultTypes = {
	size: 'medium'
}