/**
 * Need
 *
 * Allows a professional to sign their name or set their passcode based on
 * what is missing
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-10-05
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

// Project components
import Modal from 'components/elements/Modal';

// Local components
import Passcode from './Passcode';
import Signature from './Signature';

/**
 * Need
 *
 * @name Need
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Need(props) {

	// Render
	return (
		<Modal
			open={true}
		>
			{props.tasks.includes('signature') &&
				<Signature
					locale={props.locale}
					onStored={() => props.onTaskDone('signature')}
				/>
			}
			{props.tasks.includes('passcode') &&
				<Passcode
					locale={props.locale}
					onStored={() => props.onTaskDone('passcode')}
				/>
			}
		</Modal>
	);
}

// Valid props
Signature.propTypes = {
	locale: PropTypes.string.isRequired,
	onTaskDone: PropTypes.func.isRequired,
	tasks: PropTypes.arrayOf(PropTypes.string).isRequired
}