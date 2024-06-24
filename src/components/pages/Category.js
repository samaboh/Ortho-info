/**
 * Category
 *
 * Shows a Category page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-06-21
 */

// Ouroboros modules
import body from '@ouroboros/body'

// NPM modules
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import ReactPaginate from 'react-paginate';

// Project components
import Loading from 'components/elements/Loading'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Locale from 'tools/locale'

// Local components
import Search from 'components/composites/Header/Search';

// Constants
import TEXT from 'translations/category'

/**
 * Category
 *
 * @name Category
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Category(props) {
	// State
	const [bodypart, bodypartSet] = useState(null)
	const [categories, categoriesSet] = useState(null)
	const [currentPage, currentPageSet] = useState(0);

	// Refs
	const refUri = useRef("")

	// Hooks
	const location = useLocation()
	const navigate = useNavigate()

	// Location effect
	useEffect(() => {
		// Set the ref
		refUri.current = location.pathname.split("/")[2]

		// Fetch the pathology
		body.read("public", "body_part/by/url", {
			url: refUri.current,
		}).then((data) => {
			// If the locale doesn't match what we are on
			if (data._locale !== props.locale) {
				Locale.set(data._locale)
			}

			// Set the bodypart
			bodypartSet(data)
		})
	}, [location.pathname])

	// Props Locale effect
	useEffect(() => {
		// If we have a body part, and it doesn't match the new locale
		if (bodypart && bodypart._locale !== props.locale) {
			// If we have the locale
			if (props.locale in bodypart.locales) {
				bodypartSet(null)
				navigate(`/${_.uri}/${bodypart.locales[props.locale].uri}`)
			} else {
				navigate(`/conditions/`)
			}
		}

		// Fetch all the categories by locale
		body.read("public", "body_parts/by/locale", {
			locale: props.locale,
		}).then(categoriesSet)
	}, [props.locale])

	// If We don't have data yet
	if (bodypart === null) {
		return <Loading {...props} />
	}

	// Text
	const _ = TEXT[props.locale]

	function handleSelectChange(event) {
		const selectedUri = event.target.value
		if (selectedUri !== "Select Category") {
			// Perform navigation logic based on the selectedUri
			// For example, use React Router to navigate to the selected category
			navigate(`/${_.uri}/${selectedUri}`)
		}
	}

	function handlePageClick({ selected: selectedPage }) {
		currentPageSet(selectedPage);
	}

	const PER_PAGE = 6;
	const offset = currentPage * PER_PAGE;
	const currentPageData = bodypart["pathologies"]
		.slice(offset, offset + PER_PAGE)
		.map((o) => (
			<div key={o.uri} className="condition">
				<Link to={`/condition/${o.uri}`}>
					{o.photos && o.photos.length !== 0 && (
						<div className="cond-image">
							<img
								src={o.photos[0].url}
								alt={o.title}
							/>
						</div>
					)}
				</Link>
				<h3>{o.title}</h3>
			</div>
		));
	const pageCount = Math.ceil(bodypart["pathologies"].length / PER_PAGE);

	// Render location
	return (
		<div id="conditions">
			<h1 className="flex">{bodypart.title}</h1>
			<div className="outer-wrapper container">
				<div className="select-category">
					<Search location={location} {...props} />
					<select onChange={(e) => handleSelectChange(e)}>
						<option value={"select category"}>{_.select}</option>
						{categories && categories.map((o) => (
							<option
								key={o.uri}
								value={o.uri}
							>
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
							<Link
								className={
									refUri.current === o.uri ? "selected" : null
								}
								key={o.uri}
								to={`/${_.uri}/${o.uri}`}
							>
								{o.title}
							</Link>
						))}
					</div>
				)}
				</div>
			</div>
		</div>
	)
}

// Valid props
Category.propTypes = {
	locale: PropTypes.string.isRequired,
}
