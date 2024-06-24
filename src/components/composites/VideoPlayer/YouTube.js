/**
 * YouTube
 *
 * Generates the necessary embed code to display a youtube video, or list of
 * videos, by key
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-04-30
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Constants
const SIZES = {
	small: { width: 248, height: 157 },
	medium: { width: 560, height: 315 },
	large: { width: 1120, height: 630 }
}

/**
 * YouTube
 *
 * Displays a player for the video or list of videos that needs to be displayed
 *
 * @name YouTube
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function YouTube(props) {

	// If the type is playlist
	if(props.value.type === 'playlist') {
		return (
			<iframe
				width={SIZES[props.size].width}
				height={SIZES[props.size].height}
				src={`https://www.youtube.com/embed/videoseries?list=${props.value.videoId}`}
				title="Ortho Info"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			></iframe>
		);
	} else if(props.value.type === 'video') {
		return (
			<iframe
				width={SIZES[props.size].width}
				height={SIZES[props.size].height}
				src={`https://www.youtube.com/embed/${props.value.videoId}`}
				title="OrthonInfo"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			></iframe>
		);
	} else {
		return (
			<b>"{props.value.type}" Not Found</b>
		);
	}
}

// Valid props
YouTube.propTypes = {
	size: PropTypes.oneOf(['small', 'medium', 'large']).isRequired,
	value: PropTypes.exact({
		type: PropTypes.oneOf(['playlist', 'video']),
		videoId: PropTypes.string.isRequired
	})
}