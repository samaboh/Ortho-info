/**
 * History
 *
 * Displays the history popup
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-09-29
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Project components
import Modal from 'components/elements/Modal';

// Local components
import Referrals from './Referrals';
import Shares from './Shares';

// Constants
import TEXT from 'translations/history';

/**
 * History
 *
 * Handles mapping of routers in link sharing path
 *
 * @name History
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function History(props) {

	// State
	const [tab, tabSet] = useState('referrals');

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<Modal
			open={props.open}
			onClose={props.onClose}
		>
			<div className="history-tabs">
				<div
					className={'history-tab ' + (tab === 'referrals' ? ' selected' : '')}
					onClick={() => tabSet('referrals')}
				>{_.referral}</div>
				<div
					className={'history-tab ' + (tab === 'shares' ? ' selected' : '')}
					onClick={() => tabSet('shares')}
				>{_.share}</div>
			</div>
			<div id="history">
				{tab === 'referrals' &&
					<Referrals locale={props.locale} />
				}
				{tab === 'shares' &&
					<Shares locale={props.locale} />
				}
			</div>
		</Modal>
	);
}

// Valid props
History.propTypes = {
	locale: PropTypes.string.isRequired,
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired
}