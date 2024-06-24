/**
 * History: Referrals
 *
 * Displays the referrals for the professional
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-09-29
 */

// Ouroboros modules
import body from '@ouroboros/body';
import { increment, iso, nice, timestamp } from '@ouroboros/dates';
import events from '@ouroboros/events';
import { nicePhone } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';

// Project components
import ReferralAttachmentURL from 'components/elements/ReferralAttachmentURL';
import { useWidth } from 'hooks/width';

// Text
import TEXT from 'translations/referrals';

/**
 * Referrals
 *
 * Handles mapping of routers in link sharing path
 *
 * @name Referrals
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Referrals(props) {

	// State
	const [end, endSet] = useState(iso(increment(0), false));
	const [name, nameSet] = useState('');
	const [records, recordsSet] = useState(false);
	const [start, startSet] = useState(iso(increment(-7), false));

	// Hooks
	const width = useWidth();

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
			'professional', 'referrals', oData
		).then(recordsSet, error => {
			events.get('error').trigger(error);
		});
	}

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="referrals">
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
							<th><i className="fa-solid fa-file-pdf" style={{fontSize: '1.2em'}} /></th>
							{['xs', 'sm'].includes(width) ? (
								<React.Fragment>
									<th>
										{_.name}<br />
										{_.date}
									</th>
									<th>
										{_.referred_clinic}<br />
										{_.date_accepted}
									</th>
								</React.Fragment>
							) : (
								<React.Fragment>
									<th>{_.name}</th>
									<th>{_.date}</th>
									<th>{_.referred_clinic}</th>
									<th>{_.date_accepted}</th>
								</React.Fragment>
							)}

						</tr>
					</thead>
					<tbody>
						{records.map(o =>
							<tr key={o._id}>
								<td><ReferralAttachmentURL value={o._id} /></td>
								{['xs', 'sm'].includes(width) ? (
									<React.Fragment>
										<td>
											{o.name}<br />
											{nice(o._created, props.locale)}<br />
										</td>
										<td>
											{o.clinic &&
												<React.Fragment>
													<span id={'tt' + o._id.substring(0,8)}>{o.clinic.name}</span>
													<Tooltip anchorSelect={`#tt${o._id.substring(0,8)}`} clickable>
														<div>
															<p><a href={`tel:${o.clinic.phone_number}`}>{nicePhone(o.clinic.phone_number)}</a></p>
															<p><a href={`mailto:${o.clinic.email}`}>{o.clinic.email}</a></p>
															<p>{o.clinic.address.line_one}{o.clinic.address.line_two && `, ${o.clinic.address.line_two}`}, {o.clinic.address.city}</p>
														</div>
													</Tooltip>
													<br />
												</React.Fragment>
											}
											{(o.interactions && o.interactions.contacted_at) ?
												nice(o.interactions.contacted_at, props.locale) :
												''
											}
										</td>
									</React.Fragment>
								) : (
									<React.Fragment>
										<td>{o.name}</td>
										<td>{nice(o._created, props.locale)}</td>
										<td>
											{o.clinic &&
												<React.Fragment>
													<span id={'tt' + o._id.substring(0,8)}>{o.clinic.name}</span>
													<Tooltip anchorSelect={`#tt${o._id.substring(0,8)}`} clickable>
														<div>
															<p><a href={`tel:${o.clinic.phone_number}`}>{nicePhone(o.clinic.phone_number)}</a></p>
															<p><a href={`mailto:${o.clinic.email}`}>{o.clinic.email}</a></p>
															<p>{o.clinic.address.line_one}{o.clinic.address.line_two && `, ${o.clinic.address.line_two}`}, {o.clinic.address.city}</p>
														</div>
													</Tooltip>
												</React.Fragment>
											}
										</td>
										<td>{(o.interactions && o.interactions.contacted_at) ?
											nice(o.interactions.contacted_at, props.locale) :
											''
										}</td>
									</React.Fragment>
								)}
							</tr>
						)}
					</tbody>
				</table>
			}
		</div>
	);
}

// Valid props
Referrals.propTypes = {
	locale: PropTypes.string.isRequired
}