/**
 * Conditions
 *
 * Shows all conditions
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-17
 */

// Ouroboros modules
import body from "@ouroboros/body"

// NPM modules
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import ReactPaginate from "react-paginate";

// Project components
import Loading from "components/elements/Loading"
import { Link, useLocation, useNavigate } from "react-router-dom"

// Local components
import Search from '../composites/Header/Search';

// Constants
import TEXT from "translations/conditions"

/**
 * Conditions
 *
 * @name Conditions
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Conditions(props) {
	// State
	const [categories, categoriesSet] = useState(null)
	const [catFlags, catFlagsSet] = useState([])
	const [conditions, conditionsSet] = useState(null)
	const [conditionsAll, conditionsAllSet] = useState(null)
	const [currentPage, currentPageSet] = useState(0);


	// Hooks
	const location = useLocation()
	const navigate = useNavigate()

	// Locale effect
	useEffect(() => {
		// Fetch all the conditions by locale
		body.read("public", "__list", [
			["pathologies/by/locale", { locale: props.locale }],
			["body_parts/by/locale", { locale: props.locale }],
		]).then((data) => {
			conditionsAllSet(data[0][1].data)
			categoriesSet(data[1][1].data)
		})

		// Clear the body parts no matter what, it's too complicated to try
		//	to keep track of them from locale to locale
		catFlagsSet(null)
	}, [props.locale])

	// If the location changes
	useEffect(() => {
		// If it's empty
		if (location.search === "" || location.search === "?") {
			// Set no body parts
			catFlagsSet(null)
		}

		// Else, if we have something in the search
		else {
			// Get the categories by removing the '?cat=', and splitting the
			//	remainder
			const lCats = location.search.substring(5).split(",")

			//  Set the new flags
			catFlagsSet(lCats)
		}
	}, [location.search])

	// If the conditions and/or the flags set change
	useEffect(() => {
		// If we don't have conditions yet, do nothing
		if (conditionsAll === null) {
			return
		}

		// If we have no flags, show everything
		if (catFlags === null) {
			conditionsSet(conditionsAll)
		}

		// Else, we have individual cats
		else {
			// Init a new list
			const lConditions = []

			// Go through all of them
			for (const o of conditionsAll) {
				// Go through each body part
				for (const s of o.body_parts) {
					// If the body part exists in the flags
					if (catFlags.includes(s)) {
						lConditions.push(o)
						break
					}
				}
			}

			// Set the new conditions
			conditionsSet(lConditions)
		}
	}, [conditionsAll, catFlags])

	// Called when any body part is clicked
	/*function toggleBodyPart(uri) {

		// Clone the flags set
		const lFlags = catFlags ? clone(catFlags) : [];

		// Try to find the flag in the existing list
		const i = lFlags.indexOf(uri);

		// If it exists, remove it
		if(i > -1) {
			lFlags.splice(i, 1);
		}

		// Else, add it
		else {
			lFlags.push(uri);
			lFlags.sort()
		}

		// Set the new location
		if(lFlags.length === 0) {
			navigate('/conditions');
		} else {
			navigate(`/conditions?cat=${lFlags.join(',')}`);
		}
	}*/

	// If We don't have data yet
	if (conditions === null) {
		return <Loading {...props} />
	}

	// Called when the categories change in the select
	function handleSelectChange(event) {
		const selectedUri = event.target.value;
		if (selectedUri !== "Select Category") {
			// Perform navigation logic based on the selectedUri
			// For example, use React Router to navigate to the selected category
			navigate(`/${_.uri}/${selectedUri}`);
		}
	}

	// Called when a page is clicked
	function handlePageClick({ selected: selectedPage }) {
		currentPageSet(selectedPage);
	}

	const PER_PAGE = 6;
	const offset = currentPage * PER_PAGE;
	const currentPageData = conditions
		.slice(offset, offset + PER_PAGE)
		.map((o) => (
			<div key={o.uri} className="condition">
				<Link to={`/condition/${o.uri}`}>
					{o.photos && o.photos.length !== 0 && (
						<div className="cond-image">
							<img
								src={o.photos[0].url}
								alt={o.title}
								loading="lazy"
							/>
						</div>
					)}
					<h3>{o.title}</h3>
				</Link>
			</div>
		));
	const pageCount = Math.ceil(conditions.length / PER_PAGE);

	// Text
	const _ = TEXT[props.locale];

	// Render location
	return (
		<div id="conditions">
			<h1 className="flex">{_.title}</h1>
			<div className="outer-wrapper container">
				<div className="select-category">
					<Search location={location} {...props} />
					<select onChange={(e) => handleSelectChange(e)}>
						<option value={"select category"}>
							{_.select}
						</option>
						{categories &&
							categories.map((o) => (
								<option key={o.uri} value={o.uri}>
									{o.title}
								</option>
							))}
					</select>
				</div>
				<div className="wrapper flexDynamic">
					{currentPageData}
					<ReactPaginate
						previousLabel={"<"}
						nextLabel={">"}
						pageCount={pageCount}
						onPageChange={handlePageClick}
						containerClassName={"pagination"}
						previousLinkClassName={"pagination__link"}
						nextLinkClassName={"pagination__link"}
						disabledClassName={"pagination__link--disabled"}
						activeClassName={"pagination__link--active"}
						marginPagesDisplayed={1}
						pageRangeDisplayed={1}
					/>
				</div>
				<div className="side-bar">
					<h3>{_.search}</h3>
					<div className="side-bar-search">
						<Search location={location} {...props} />
					</div>
					{(categories === null && <Loading {...props} />) || (
						<div id="categories" className="flexStatic">
							<h3>{_.categories}</h3>
							{categories.map((o) => (
								<Link key={o.uri} to={`/${_.uri}/${o.uri}`}>
									{o.title}
								</Link>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Valid props
Conditions.propTypes = {
	locale: PropTypes.string.isRequired,
}
