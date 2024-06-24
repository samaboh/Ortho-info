// NPM modules
import React, { useEffect, useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';

// Project modules
import VideoPlayer from 'components/composites/VideoPlayer';

// Local modules
import Product from './Product';

// Constants
import TEXT from 'translations/condition';
const VIDEO_SIZES = {
	xs: 'small',
	sm: 'medium',
	md: 'medium',
	lg: 'large',
	xl: 'large',
};

export default function Tabs(props) {

	// State
	const [currentImage, currentImageSet] = useState(0);
	const [isViewerOpen, isViewerOpenSet] = useState(false);
	const [isVisible, isVisibleSet] = useState(false);

	// Load Effect
	useEffect(() => {

		// On tab open scroll to top of tab
		document.querySelector("#content").scrollTo(0, 0);

		// For mobile pop up transition
		isVisibleSet(true);
	}, []);

	// Text
	const _ = TEXT[props.locale];

	// Define the tabs array within the component
	const tabs = [{
		title: (
			<div className="flex">
				<i className="fa fa-arrow-left"></i>
				<p>&nbsp;{_.main}</p>
			</div>
		),
		mainHeading: "",
		mainContent: "",
		sideContent: "",
	}, {
		title: _.detail,
		mainHeading: props.pathology?.title,
		mainContent: props.pathology?.content,
		sideContent: (
			<div>
				{props.pathology?.photos && props.pathology.photos.length > 0 && (
					<div
						className="image-container"
						onClick={() => openImageViewer(0)}
					>
						{props.pathology.photos.map((o) => (
							<img
								key={o.filename}
								src={o.url}
								alt={props.pathology.title}
							/>
						))}
						<div className="zoom-pic">
							<i className="fa-solid fa-magnifying-glass-plus"></i>{" "}
						</div>
					</div>
				)}
			</div>
		)
	}];

	// If we have an exercise video
	if(props.pathology?.exercises_video) {
		tabs.push({
			title: _.recommended,
			mainHeading: _.recommended,
			mainContent: props.pathology?.exercises_content,
			sideContent: (
				<div className="vid-div">
					{props.pathology?.exercises_video && (
						<VideoPlayer
							size={VIDEO_SIZES["xs"]}
							value={props.pathology?.exercises_video}
						/>
					)}
				</div>
			),
		});
	}

	// If we have a benefits video
	if(props.pathology?.benefits_video) {
		tabs.push({
			title: _.related,
			mainHeading: _.related_explanation,
			mainContent: props.pathology?.benefits_content,
			sideContent: (
				<div className="vid-div">
					{props.pathology?.benefits_video && (
						<VideoPlayer
							size={VIDEO_SIZES["xs"]}
							value={props.pathology?.benefits_video}
						/>
					)}
				</div>
			),
		});
	}

	const handleTabClick = (index) => {
		if (index === 0) {
			props.conditionTabSet(false);
		}
		props.setActiveTab(index);
	};

	//image viewer
	const openImageViewer = (index) => {
		currentImageSet(index);
		isViewerOpenSet(true);
	};

	const closeImageViewer = () => {
		currentImageSet(0);
		isViewerOpenSet(false);
	};

	return (
		<div className="tabs-container container">
			<div className="tab-button-container">
				{tabs.map((tab, index) => (
					<button
						key={index}
						onClick={() => handleTabClick(index)}
						className={props.activeTab === index ? ' active' : ''}
					>
						{tab.title}
					</button>
				))}
			</div>
			<div className="tab-content">
				<div className="tab-main-content">
					<div className="main-heading">
						<h2>{tabs[props.activeTab]?.mainHeading}</h2>
					</div>
					<div className="before-content">
						<div
							className={`content-div ${isVisible ? 'visible' : ''}`}
							dangerouslySetInnerHTML={{
								__html: tabs[props.activeTab]?.mainContent,
							}}
						/>
						<button className="content-close flex" onClick={() => props.conditionTabSet(false)}>
							x
						</button>
					</div>
				</div>
				<div className="tab-side-bar">
					<div className="">{tabs[props.activeTab]?.sideContent}</div>
				</div>
			</div>
			{props.pathology?.products.length !== 0 && (
				<div className="condition-products">
					<h2>{_.related}</h2>
					<div className="wrapper">
						{props.pathology?.products.map((o) => (
							<Product locale={props.locale} value={o} />
						))}
					</div>
				</div>
			)}
			{isViewerOpen && (
				<ImageViewer
					src={props.pathology?.photos.map((photo) => photo.url)}
					currentIndex={currentImage}
					onClose={closeImageViewer}
					disableScroll={false}
					backgroundStyle={{
						backgroundColor: "rgba(0,0,0,0.9)",
					}}
					closeOnClickOutside={true}
				/>
			)}
		</div>
	);
}

