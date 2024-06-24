/**
 * History: Shares
 *
 * Displays the referrals for the professional
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-09-29
 */

// Ouroboros modules
import body from '@ouroboros/body';
import { increment, iso, timestamp } from '@ouroboros/dates';
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// Text
import TEXT from 'translations/shares';

/**
 * Shares
 *
 * Handles mapping of routers in link sharing path
 *
 * @name Shares
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Shares(props) {

	// State
	const [end, endSet] = useState(iso(increment(0), false));
	const [name, nameSet] = useState('');
	const [records, recordsSet] = useState(false);
	const [start, startSet] = useState(iso(increment(-7), false));

	// Load effect
	useEffect(() => {
		submit();
	}, []);

	// Called on every key press to see if someone pressed the enter key
	function checkEnter(ev) {
		if(ev.key === 'Enter') {
			submit();
		}
	}

	// Called to search
	function submit(ev) {

		// Cancel normal action
		if(ev) {
			ev.preventDefault();
			ev.stopPropagation();
		}

		// Init the data using the start/end
		const oData = {
			start: timestamp(start + ' 00:00:00'),
			end: timestamp(end + ' 23:59:59')
		}

		// If we have a name
		if(name.trim() !== '') {
			oData.name = name.trim();
		}

		// Fetch the contacted leads
		body.read(
			'professional', 'shares', oData
		).then(recordsSet, error => {
			events.get('error').trigger(error);
		});
	}

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="shares">
			<div className="flexColumns">
				<div className="history-input">
					<input type="date"
						min="2023-06-01"
						max={end}
						onChange={ev => startSet(ev.target.value)}
						value={start}
					/>
					&nbsp;-&nbsp;
					<input type="date"
						min={start}
						max={iso(Date.now(), false)}
						onChange={ev => endSet(ev.target.value)}
						value={end}
					/>
					&nbsp;&nbsp;
					<input type="text"
						className="patientName"
						onChange={ev => nameSet(ev.target.value)}
						onKeyDown={checkEnter}
						placeholder={_.name}
						value={name}
					/>
					<button className="button" type="submit" onClick={submit}>
						{_.search}
					</button>
				</div>
				<div className="flexDynamic right count">
					{_.count}: {records.length}
				</div>
			</div>
			{records !== false &&
				<table className="records">
					<thead>
						<tr>
							<th>{_.pathology}</th>
							<th>{_.name}</th>
							<th>{_.date}</th>
						</tr>
					</thead>
					<tbody>
						{records.map(o =>
							<tr key={o._id}>
								<td><a href={o.url} target="_blank" rel="noreferrer">{o.url}</a></td>
								<td>{o.name}</td>
								<td><nobr>{iso(o._created)}</nobr></td>
							</tr>
						)}
					</tbody>
				</table>
			}
		</div>
	);
}

// Valid props
Shares.propTypes = {
	locale: PropTypes.string.isRequired
}