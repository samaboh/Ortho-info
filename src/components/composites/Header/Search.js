/**
 * Search
 *
 * Handles search bar and results
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-21
 */

// Ouroboros modules
import body from '@ouroboros/body';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Constants
import TEXT from 'translations/search';

/**
 * Search
 *
 * Top of the page
 *
 * @name Search
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Search(props) {

	// State
	const [focused, focusedSet] = useState(false);
	const [results, resultsSet] = useState([]);

	// Refs
	const refSearch = useRef();

	// Locale effect
	useEffect(() => {
		resultsSet([]);
		if(refSearch.current) {
			refSearch.current.value = '';
		}
	}, [props.locale]);

	// Called whenever the query value changes
	function search(ev) {
		if(search === '') {
			resultsSet([]);
		} else {
			body.read('public', 'search', {
				q: ev.target.value,
				locale: props.locale
			}).then(resultsSet)
		}
	}

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div className="search">
			<i className="fa-solid fa-magnifying-glass search-icon"></i>
			<input
				onChange={search}
				onFocus={() => focusedSet(true)}
				ref={refSearch}
				type="text"
				placeholder={_.pathology}
			/>
			<div className='search-button'>
				<i className="fa-solid fa-magnifying-glass search-icon2"></i>
				<p>{_.search}</p>
			</div>
			{(results.length > 0 && focused) &&
				<div className="results">
					{results.map(o => {
						const url = `/${_.paths[o.type]}/${o.uri}`;
						return (
							<Link
								to={url}
								key={o.uri}
								onClick={() => focusedSet(false)}
							>
								<div
									className={
										"result" +
										(props.location.pathname === url
											? " selected"
											: "")
									}
								>
									<div className="result-img-div">
										{o.photos && o.photos.length > 0 && (
											<img
												className="result-img"
												src={o.photos[0]}
												alt={o.title}
											/>
										)}
									</div>

									<div className='result-text'>
										<p className="title">{o.title}</p>
										<p className="content">{o.content}</p>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			}
		</div>
	);
}

// Valid props
Search.propTypes = {
	locale: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired
}