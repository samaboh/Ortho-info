/**
 * Errors
 *
 * Handles displaying a list of errors
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-10-03
 */

// Ouroboros modules
import clone from '@ouroboros/clone';
import events from '@ouroboros/events';
import { afindi, isObject } from '@ouroboros/tools';

// NPM modules
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Errors
 *
 * Displays the list of current errors
 *
 * @name Errors
 * @access public
 * @param Object props Properties passed to the component
 * @return React.Component
 */
export default function Errors(props) {

	// State
	let [errors, errorsSet] = useState([]);

	// Load effect
	useEffect(() => {

		// Subscribe to error events
		events.get('error').subscribe(add);

		// Unsubscribe to error events
		return () => {
			events.get('error').unsubscribe(add);
		}
	}, []);

	// Add an error
	function add(text) {

		// Generate the new error ID
		let oError = {_id: uuidv4()}

		// If it's an object, add it as a preformatted message
		if(isObject(text)) {
			oError.content = <pre>{JSON.stringify(text, null, 4)}</pre>
		} else {
			oError.content = text.split('\n').map((s,i) => <p key={i}>{s}</p>);
		}

		// Add the text with a new unique ID
		errorsSet(val => {
			let lVal = clone(val);
			lVal.push(oError);
			return lVal;
		});
	}

	// Remove an error
	function remove(_id) {

		// Find the index
		let i = afindi(errors, '_id', _id);

		// If it exists
		if(i > -1) {
			let lErrors = clone(errors);
			lErrors.splice(i, 1);
			errorsSet(lErrors);
		}
	}

	// If there's no errors
	if(errors.length === 0) {
		return '';
	}

	// Display the errors
	return (
		<div id="errors">
			{errors.map(o =>
				<div key={o._id} className="error flexColumns">
					<div className="text flexDynamic">
						{o.content}
					</div>
					<p className="close flexStatic">
						<i className="fas fa-times-circle" onClick={() => remove(o._id)} />
					</p>
				</div>
			)}
		</div>
	);
}