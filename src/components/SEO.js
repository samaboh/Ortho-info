/**
 * SEO
 *
 * Handles title and description data in the header
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-28
 */

// Ouroboros modules
import body, { errors } from '@ouroboros/body';
import clone from '@ouroboros/clone';
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO
 *
 * Top of the page
 *
 * @name SEO
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function SEO(props) {

	// State
	const [home, homeSet] = useState({});

	// Hooks
	const location = useLocation();

	// Pathname effect
	useEffect(() => {

		// Called to set the tags using the home data if it exists, else by fetching
		//	the home data from the server, then using it
		const setHomeOrFetch = (locale) => {

			// If the data exists, set the tags using the home data
			if(locale in home) {
				setTags(locale, home[locale]);
			}

			// Else, fetch it from the server, which will take care of setting
			//	it
			else {

				// Get the info
				body.read('public', 'seo', {
					'_url': '/'
				}).then(data => {

					// If we got the data
					if(data) {

						// Get the right locale data
						const oData = props.locale in data ?
										data[props.locale] :
										data[Object.keys(data)[0]];

						// Set the home data
						homeSet(val => {
							const oHome = clone(val);
							oHome[locale] = oData;
							return oHome;
						});

						// Set the tags
						setTags(locale, oData);
					}
				}, error => {
					events.get('error').trigger(error);
					console.error(error);
				});
			}
		}

		// If the url is empty
		if(location.pathname === '/') {
			setHomeOrFetch(props.locale);
		}

		// Else, we have a specific page
		else {

			// Get the info
			body.read('public', 'seo', {
				'_url': location.pathname
			}).then(data => {
				if(data) {

					// Get the right locale data
					const oData = props.locale in data ?
										data[props.locale] :
										data[Object.keys(data)[0]];

					// Set the tags
					setTags(props.locale, oData);
				} else {
					setHomeOrFetch(props.locale);
				}
			}, error => {
				events.get('error').trigger(error);
				console.error(error);
			});
		}

	}, [location.pathname, props.locale, home])

	// Called to set the title and description
	function setTags(locale, data) {

		// Set the title
		document.title = data.title;

		// Find the HTML tag and set the lang
		document.getElementsByTagName('HTML')[0].lang = locale.substring(0,2);

		// Fetch all the meta tags
		const lMeta = document.getElementsByTagName('META');

		// Step through each one
		for(const o of lMeta) {

			// If we get a title element
			if(o.name === 'title' || ['og:title', 'twitter:title'].includes(o.property)) {
				o.content = data.title;
			}

			// If we get a description element
			if(o.name === 'description' || ['og:description', 'twitter:description'].includes(o.property)) {
				o.content = data.description || '';
			}
		}
	}

	// Render
	return null;
}

// Valid props
SEO.propTypes = {
	locale: PropTypes.string.isRequired
}