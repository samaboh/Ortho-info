/**
 * About
 *
 * About Us
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

// Project modules
import Locale from 'tools/locale';

// Constants
import TEXT from 'translations/about';
const PATHS = {
	'/about': 'en-CA',
	'/apropos': 'fr-CA',
};

/**
 * About
 *
 * About Us
 *
 * @name About
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function About(props) {
	// Refs
	const initialRef = useRef(true);

	// Hooks
	const location = useLocation();
	const navigate = useNavigate();

	// Location effect
	useEffect(() => {
		// If the locale doesn't match what we are on
		if (PATHS[location.pathname] !== props.locale) {
			Locale.set(PATHS[location.pathname]);
		}
	}, [location.pathname]);

	// Props Locale effect
	useEffect(() => {
		// We only want this to fire if the locale has changes SINCE the first
		//	time, otherwise we just end up in an endless loop of the url
		//	changing the locale, and the locale then changing the url
		if (initialRef.current) {
			initialRef.current = false;
			return;
		}

		// If the paths don't match
		if (TEXT[props.locale].path !== location.pathname) {
			navigate(TEXT[props.locale].path);
		}
	}, [props.locale]);

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="about">
			<h1 className="flex">{TEXT[props.locale].title}</h1>
			<div className="about-container container">
				<div className="about-section">
					<div className="about-text">
						<p style={{ whiteSpace: "pre-line" }}>{_.left}</p>
					</div>
					<div className="about-image">
						<img
							src="https://orthoinfo.s3.us-east-1.amazonaws.com/www/about-us-right.jpg"
							alt="doctor-stethoscope"
						/>
					</div>
				</div>
				<div className="about-section">
					<div className="about-image">
						<img
							src="https://orthoinfo.s3.us-east-1.amazonaws.com/www/about-us-left.jpg"
							alt="doctor-touch-screen"
						/>
					</div>

					<div className="about-text">
						<p style={{ whiteSpace: "pre-line" }}>{_.right}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

// Valid props
About.propTypes = {
	locale: PropTypes.string.isRequired,
};
