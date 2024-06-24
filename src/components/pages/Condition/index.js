/**
 * Condition
 *
 * Condition available in the system
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// Ouroboros modules
import body from '@ouroboros/body';
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ImageViewer from 'react-simple-image-viewer';

// Project modules
import Locale from 'tools/locale';

// Project components
import FourOhFour from 'components/pages/FourOhFour';
import Loading from 'components/elements/Loading';
import VideoPlayer from 'components/composites/VideoPlayer';

// Local components
import Product from './Product';
import Tabs from './Tabs';

// Constants
import TEXT from 'translations/condition';
const VIDEO_SIZES = {
	xs: 'small',
	sm: 'medium',
	md: 'medium',
	lg: 'large',
	xl: 'large',
};

/**
 * Condition
 *
 * Condition
 *
 * @name Condition
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Condition(props) {
	// State
	const [pathology, pathologySet] = useState(null);
	const [conditionTab, conditionTabSet] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const [currentImage, currentImageSet] = useState(0);
	const [isViewerOpen, isViewerOpenSet] = useState(false);

	// Hooks
	const location = useLocation();
	const navigate = useNavigate();

	// Location effect
	useEffect(() => {
		// Fetch the pathology
		body.read('public', 'pathology/by/url', {
			url: location.pathname.substring(11),
		}).then(
			(data) => {
				// If the locale doesn't match what we are on
				if (data._locale !== props.locale) {
					Locale.set(data._locale);
				}

				// Set the pathology
				pathologySet(data);
			},
			(error) => {
				events.get('error').trigger(error);
				pathologySet(false);
			}
		);
	}, [location.pathname]);

	// Props Locale effect
	useEffect(() => {
		// If we have pathology, and it doesn't match the new locale
		if (pathology && pathology._locale !== props.locale) {
			// If we have the locale
			if (props.locale in pathology.locales) {
				pathologySet(null);
				navigate(`/condition/${pathology.locales[props.locale].uri}`);
			} else {
				navigate(`/conditions/`);
			}
		}
	}, [props.locale, navigate]);

	// If We don't have data yet
	if (pathology === null) {
		return <Loading {...props} />;
	}

	// If we got it, and it's invalid
	if (pathology === false) {
		return <FourOhFour {...props} />;
	}

	//image viewer
	const openImageViewer = (index) => {
		currentImageSet(index);
		isViewerOpenSet(true);
	};

	const closeImageViewer = () => {
		currentImageSet(0);
		isViewerOpenSet(false);
	};

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<div id="condition" className="container">
			<div className="condition-card">
				<h3>{pathology.title}</h3>
				{pathology.photos && pathology.photos.length > 0 && (
					<div
						className="image-container"
						onClick={() => openImageViewer(0)}
					>
						{pathology.photos.map((o) => (
							<img
								key={o.filename}
								src={o.url}
								alt={pathology.title}
							/>
						))}
						<div className="zoom-pic">
							<i className="fa-solid fa-magnifying-glass-plus"></i>
						</div>
					</div>
				)}
				<button
					onClick={() => {
						conditionTabSet(true);
						setActiveTab(1);
					}}
				>
					{_.view_details}
				</button>
			</div>
			<div className="condition-card">
				<h3>{_.recommended}</h3>
				{pathology.exercises_video ? (
					<React.Fragment>
						<div className="vid-div">
							<VideoPlayer
								size={VIDEO_SIZES["sm"]}
								value={pathology.exercises_video}
							/>
						</div>
						<button
							onClick={() => {
								conditionTabSet(true);
								setActiveTab(2);
							}}
						>
							{_.view_exercises}
						</button>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className="vid-div">
							An image stating to seek a specialist
						</div>
						<button
							className="blue_bg"
							onClick={() => events.get('consultation').trigger(true)}
						>{_.consultation}</button>
					</React.Fragment>
				)}
			</div>
			<div className="condition-card">
				<h3>{_.device}</h3>
				{pathology.benefits_video ? (
					<React.Fragment>
						<div className="vid-div">
							<VideoPlayer
								size={VIDEO_SIZES["sm"]}
								value={pathology.benefits_video}
							/>
						</div>
						<button
							onClick={() => {
								conditionTabSet(true);
								setActiveTab(3);
							}}
						>{_.view_details}</button>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className="vid-div">
							An image stating to seek a specialist
						</div>
						<button
							className="blue_bg"
							onClick={() => events.get('consultation').trigger(true)}
						>{_.consultation}</button>
					</React.Fragment>
				)}
			</div>

			<div className="condition-card">
				<h3>{_.related}</h3>
				{pathology.products && pathology.products.length ? (
					<React.Fragment>
						<div className="wrapper">
							{pathology.products.map((o) => (
								<Product locale={props.locale} value={o} />
							))}
						</div>
						<button
							onClick={() => {
								conditionTabSet(true);
								setActiveTab(3);
							}}
						>
							{_.view_products}
						</button>
					</React.Fragment>
				) : (
					<React.Fragment>
						<div className="vid-div">
							An image stating to seek a specialist for a device
						</div>
						<button
							className="blue_bg"
							onClick={() => events.get('consultation').trigger(true)}
						>{_.consultation}</button>
					</React.Fragment>
				)}
			</div>
			{isViewerOpen && (
				<ImageViewer
					src={pathology.photos.map((photo) => photo.url)}
					currentIndex={currentImage}
					onClose={closeImageViewer}
					disableScroll={false}
					backgroundStyle={{
						backgroundColor: "rgba(0,0,0,0.9)",
					}}
					closeOnClickOutside={true}
				/>
			)}
			{conditionTab && (
				<Tabs
					{...props}
					pathology={pathology}
					conditionTabSet={conditionTabSet}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
			)}
		</div>
	);
}

// Valid props
Condition.propTypes = {
	locale: PropTypes.string.isRequired,
};