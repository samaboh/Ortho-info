/**
 * Upload
 *
 * Handles a single file to be uploaded
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-02-16
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

/**
 * Upload
 *
 * Manages a single uploaded file
 *
 * @name Upload
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Upload(props) {

	// State
	let [dragging, draggingSet] = useState(false);
	let [errors, errorsSet] = useState(null);

	// Refs
	let refInput = useRef();

	// Called when the file changes
	async function change(files) {

		// If we got no files
		if(!files || files.length === 0) {
			return;
		}

		// Not sure why this is suddenly needed, used to just work by accessing
		//	files[0] in the closure
		let file = files[0];

		// Get the file as base64
		const Reader = new FileReader();
		Reader.addEventListener('load', () => {
			props.onChange({
				file: file,
				url: Reader.result
			})
		});
		Reader.readAsDataURL(files[0]);
	}

	// Handle drag events
	function drag(ev) {
		ev.preventDefault();
		ev.stopPropagation();
	};

	// Handle drag in events
	function dragIn(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		if(ev.dataTransfer.items && ev.dataTransfer.items.length > 0) {
			draggingSet(true);
		}
	};

	// Handle drag out events
	function dragOut(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		draggingSet(false);
	};

	// Handle drop
	function drop(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		draggingSet(false);
		if(ev.dataTransfer.files && ev.dataTransfer.files.length > 0) {
			change(ev.dataTransfer.files);
		}
	}

	// Handle drag start
	function dragStart(ev) {
		ev.preventDefault();
		ev.stopPropagation();
		ev.dataTransfer.clearData();
	};

	// Called when the input changes
	function inputChange(ev) {
		change(ev.target.files);
		refInput.current.value = '';
	}

	// Handle upload click
	function upload() {
		refInput.current.click();
	}

	return (
		<React.Fragment>
			<input
				type="file"
				accept={props.accept}
				ref={refInput}
				multiple={false}
				onChange={inputChange}
				style={{ display: 'none' }}
			/>
			{props.children && props.children({
				file: props.value,
				upload,
				errors,
				dragProps: {
					onDrop: drop,
					onDragEnter: dragIn,
					onDragLeave: dragOut,
					onDragOver: drag,
					onDragStart: dragStart
				},
				dragging
			})}
		</React.Fragment>
	);
}

// Valid props
Upload.propTypes = {
	accept: PropTypes.string,
	maxFileSize: PropTypes.number,
	onChange: PropTypes.func,
	onError: PropTypes.func,
	value: PropTypes.shape({
		url: PropTypes.string
	})
}

// Default props
Upload.defaultProps = {
	accept: '*'
}