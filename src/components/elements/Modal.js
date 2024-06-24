/**
 * Modal
 *
 * Shows a loading image/text/whatever
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

/**
 * Modal
 *
 * @name Modal
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Modal(props) {

	// Keep track of the mouse event callback and content div
	const refMouseClick = useRef(null);
	const refContent = useRef(null);

	// Keep track of the onClose
	const refOnClose = useRef(props.onClose);

	// Opened effect
	useEffect(() => {

		// If we are opening
		if(props.open) {

			// Track mouse clicks
			refMouseClick.current = (ev) => {

				// If we have no callback, do nothing
				if(!refOnClose.current) {
					return;
				}

				// If the click is not inside the content
				if(refContent.current &&
					!refContent.current.contains(ev.target)) {

					// Notify the parent of the close attempt
					refOnClose.current();
				}
			}

			// Add the event listener
			document.addEventListener('mousedown', refMouseClick.current);
		}

		// Else, if we are closing
		else {

			// Remove the event listener
			document.removeEventListener('mousedown', refMouseClick.current);
			refMouseClick.current = null;
			refContent.current = null;
		}

		// Remove the event listener if we have one
		return () => {
			if(refMouseClick.current) {
				document.removeEventListener(
					'mousedown', refMouseClick.current
				);
			}
		}

	}, [props.open]);

	// On Close effect
	useEffect(() => {
		refOnClose.current = props.onClose;
	}, [props.onClose]);

	// If it's not open, do nothing
	if(!props.open) {
		return null;
	}

	// Render the modal container with the children given
	return (
		<div className="modal">
			<div className="wrapper1">
				<div className="wrapper2">
					<div className="content" ref={refContent}>
						{props.children}
					</div>
				</div>
			</div>
		</div>
	);
}

// Valid props
Modal.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func
}