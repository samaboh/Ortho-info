/**
 * Site
 *
 * Primary entry into www site
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// Init body
import 'tools/body_init';

// Ouroboros modules
import events from '@ouroboros/events';

// NPM modules
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { wrapComponent } from 'react-snackbar-alert';

// Local modules
import Locale from 'tools/locale';

// Site Page components
import About from 'components/pages/About';
import Category from 'components/pages/Category';
import Condition from 'components/pages/Condition';
import Conditions from 'components/pages/Conditions';
import Contact from 'components/pages/Contact';
import Forgot from 'components/pages/Forgot';
import Home from 'components/pages/Home';
import Setup from 'components/pages/Setup';
import Verification from 'components/pages/Verification';

// Site Composite components
import Consultation from 'components/composites/Consultation';
import Footer from 'components/composites/Footer';
import Header from 'components/composites/Header';
import Share from 'components/composites/Share';

// Site additional components
import Errors from 'components/Errors';
import SEO from 'components/SEO';
import Testing from 'components/Testing';

// Data
import Data from 'tools/data'; // Makes sure we have insurance/specialists

// CSS
import '../sass/site.scss'
import FourOhFour from './pages/FourOhFour';

/**
 * Site
 *
 * Primary site component
 *
 * @name Site
 * @access public
 * @param Object props Properties passed to the component
 * @return React.Component
 */
const Site = wrapComponent(function(props) {

	// State
	const [data, dataSet] = useState(null);
	const [locale, localeSet] = useState(null);

	// Startup effect
	useEffect(() => {

		// Subscribe to events
		events.get('success').subscribe(msg => {
			props.createSnackbar({
				message: msg,
				dismissable: true,
				pauseOnHover: true,
				progressBar: true,
				sticky: false,
				theme: 'success',
				timeout: 3000
			});
		});

		// Subscribe to locale and data changes
		const oL = Locale.subscribe(localeSet);
		const oD = Data.subscribe(dataSet);

		// Clear tracking / subscriptions
		return () => {
			oL.unsubscribe();
			oD.unsubscribe();
		}
	}, []);

	// If we don't have a local yet, show splash screen
	if(locale === null || locale === '' || data.insurance.length === 0) {
		return (
			<div id="splash" className="flexDynamic">&nbsp;</div>
		);
	}

	// Page Props
	const pageProps = {
		locale: locale
	}

	// Render
	return (
		<BrowserRouter>
			<SEO {...pageProps} />
			<Header {...pageProps} />
			{['development', 'staging', 'local'].includes(process.env.NODE_ENV) &&
				<Testing {...pageProps} />
			}
			<div id="content" className="flexDynamic lightBlue_bg">
				<Routes>
					<Route path="/" element={
						<Home {...pageProps} />
					} />
					<Route path="/about" element={
						<About key="about" {...pageProps} />
					} />
					<Route path="/apropos" element={
						<About key="apropos" {...pageProps} />
					} />
					<Route path="/category/*" element={
						<Category {...pageProps} />
					} />
					<Route path="/categorie/*" element={
						<Category {...pageProps} />
					} />
					<Route path="/condition/*" element={
						<Condition {...pageProps} />
					} />
					<Route path="/conditions" element={
						<Conditions {...pageProps} />
					} />
					<Route path="/contact" element={
						<Contact {...pageProps} />
					} />
					<Route path="/forgot/*" element={
						<Forgot {...pageProps} />
					} />
					<Route path="/setup/*" element={
						<Setup {...pageProps} />
					} />
					<Route path="/verification/:key" element={
						<Verification {...pageProps} />
					} />
					<Route path="*" element={
						<FourOhFour {...pageProps} />
					} />
				</Routes>
			</div>
			<div id='share-consultation'>
				<Share {...pageProps} />
				<Consultation {...pageProps} />
			</div>
			<Footer {...pageProps} />
			<Errors />
		</BrowserRouter>
	);
});
export default Site;