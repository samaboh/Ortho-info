/**
 * Data
 *
 * Handles getting data shared across the site based on whether a user
 * is logged in or not
 *
 * @author Chris Nasr
 * @copyright Ouroboros Coding Inc.
 * @created 2023-08-11
 */

// Ouroboros modules
import body from '@ouroboros/body';
import clone from '@ouroboros/clone';
import Subscribe from '@ouroboros/subscribe';

// Constants
const REFRESH = 1000 * 60 * 5; // 5 minutes

/**
 * _Data
 *
 * Provides the basis for the single instance that will be returned from the
 * module
 *
 * @name _Data
 * @access private
 */
class _Data extends Subscribe {

	/**
	 * Constructor
	 *
	 * Creates a new instance and returns it
	 *
	 * @name _Data
	 * @access private
	 * @returns _Data
	 */
	constructor() {

		// Init the subscriber with nothing
		super({
			insurance: { list: [], tree: {} },
			recaptcha: null,
			specialists: { list: [], tree: {} }
		});

		// Private function
		const update = () => {

			// If we have a previous timeout
			if(this.timer) {
				clearTimeout(this.timer);
			}

			// Fetch the specialist and insurance types
			body.read('public', '__list', [
				'insurance_types',
				'specialist_types',
				'referral/recaptcha'
			]).then(data => {

				// Set the new data
				this.set({
					insurance: data[0][1].data,
					recaptcha: data[2][1].data,
					specialists: data[1][1].data
				});

				// Set a new timer so we keep the info updated
				setTimeout(update, REFRESH);
			});
		};

		// Call update
		update();
	}

	/**
	 * Insurance
	 *
	 * Returns a copy of the current insurance values
	 *
	 * @name insurance
	 * @readonly
	 * @access public
	 * @returns Array
	 */
	get insurance() {
		return clone(this._insurance);
	}

	/**
	 * Recaptcha
	 *
	 * Returns the recaptcha key
	 *
	 * @name recaptcha
	 * @readonly
	 * @access public
	 * @returns String
	 */
	get recaptcha() {
		return this._recaptcha;
	}

	/**
	 * Specialists
	 *
	 * Returns a copy of the current insurance values
	 *
	 * @name specialists
	 * @readonly
	 * @access public
	 * @returns Array
	 */
	get specialists() {
		return clone(this._specialists);
	}
}

// Create the one instance and export it
const Data = new _Data();
export default Data;