/**
 * Signature
 *
 * Allows a professional to sign their name and generate an image of it
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-09-26
 */

// Ouroboros modules
import body from '@ouroboros/body';
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

// Local modules
import { useWidth } from 'hooks/width';

// NPM Components
import SignatureCanvas from 'react-signature-canvas';

// Text
import TEXT from 'translations/signature';

// Constants
const DIMENSIONS = {
	'xs': { width: 300, height: 100 },
	'sm': { width: 480, height: 160 },
	'md': { width: 660, height: 220 },
	'lg': { width: 840, height: 280 },
	'xl': { width: 1020, height: 340 }
};
const NO_SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC'

/**
 * Signature
 *
 * @name Signature
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Signature(props) {

	// Refs
	const refCanvas = useRef();

	// Hooks
	const width = useWidth();

	// Called to submit the signature
	function submit() {

		// If the trimmed image has nothing in it
		if(refCanvas.current.getTrimmedCanvas().toDataURL() === NO_SIGNATURE) {
			return;
		}

		// Get the current URL
		const sURL = refCanvas.current.toDataURL();

		// Send the encoded image to the server
		body.update('professional', 'signature', {
			base64: sURL.substring(22)
		}).then(data => {
			if(data) {
				props.onStored();
			}
		}, error => {
			events.get('error').trigger(error);
		});
	}

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="signature">
			<h2>{_.title}</h2>
			<SignatureCanvas
				canvasProps={DIMENSIONS[width]}
				penColor="black"
				ref={refCanvas}
			/>
			<div className="clear">
				<span onClick={() => refCanvas.current.clear()}>
					{_.clear}
				</span>
			</div>
			<div className="buttons">
				<button
					className="button"
					onClick={submit}
					type="submit"
				>{_.submit}</button>
			</div>
		</div>
	);
}

// Valid props
Signature.propTypes = {
	locale: PropTypes.string.isRequired,
	onStored: PropTypes.func.isRequired
}