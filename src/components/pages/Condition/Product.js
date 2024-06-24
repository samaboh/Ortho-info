/**
 * Condition Product
 *
 * Displays a product
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-10-28
 */

// NPM modules
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Product
 *
 * @name Product
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Product(props) {

	// Render
	return (
		<div className="product">
			<a
				href={`https://orthopros.myshopify.com/products/${props.value.handle}`}
				rel="noreferrer"
				target="_blank"
			>
				<img src={props.value.image} alt={props.value.title} />
				<p>
					<strong>{props.value.title}</strong><br />
					${props.value.price}
				</p>
			</a>
		</div>
	);
}

// Valid props
Product.propTypes = {
	locale: PropTypes.string.isRequired,
	value: PropTypes.object.isRequired
};