/**
 * Home
 *
 * Handles title and menu
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// NPM modules
import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"

// Constants
import TEXT from 'translations/home';

/**
 * Home
 *
 * Default page of the site
 *
 * @name Home
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Home(props) {

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="home" className="flex">
			<div className="shape-container">
				<div id="oval-head" className="red-shape">
					<Link to={"/category/head"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.head}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-neck" className="red-shape">
					<Link to={"/category/neck"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.neck}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-shoulder" className="red-shape">
					<Link to={"/category/shoulder"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.shoulder}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-back" className="red-shape">
					<Link to={"/category/back"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.back}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-hips" className="red-shape">
					<Link to={"/category/hips"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.hips}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-arm" className="red-shape">
					<Link to={"/category/arm"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.arm}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-hand" className="red-shape">
					<Link to={"/category/hand"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.hand}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-knee" className="red-shape">
					<Link to={"/category/knee"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.knee}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-leg" className="red-shape">
					<Link to={"/category/leg"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.leg}<span className="triangle-right"></span>
					</div>
				</div>
				<div id="oval-foot" className="red-shape">
					<Link to={"/category/foot"}><div className="red-shape-glow"></div></Link>
					<div className="blue-tooltip">
						{_.foot}<span className="triangle-right"></span>
					</div>
				</div>
			</div>
		</div>
	)
}

// Valid props
Home.propTypes = {
	locale: PropTypes.string.isRequired
}