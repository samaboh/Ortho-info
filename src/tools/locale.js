/**
 * Locale
 *
 * Handles getting, setting, figuring out, etc, anything to do with Locales
 *
 * @author Chris Nasr
 * @copyright Ouroboros Coding Inc.
 * @created 2023-05-16
 */

// Ouroboros modules
import brain from '@ouroboros/brain';
import { subscribe, update } from '@ouroboros/brain-react';
import { cookies } from '@ouroboros/browser';
import Subscribe from '@ouroboros/subscribe';

// For the short term, let's just hardcode what is allowed
const LOCALES = {
	'en-CA': 'en-CA',
	'fr-CA': 'fr-CA',
	'en': 'en-CA',
	'fr': 'fr-CA'
}

/**
 * _Locale
 *
 * Provides the basis for the single instance that will be returned from the
 * module
 *
 * @name _Locale
 * @access private
 */
class _Locale extends Subscribe {

	/**
	 * Constructor
	 *
	 * Creates a new instance and returns it
	 *
	 * @name _Locale
	 * @access private
	 * @returns _Locale
	 */
	constructor() {

		// Init the subscriber with nothing
		super(null);

		// Check cookies for the locale
		let locale = cookies.get('locale', '')

		// If we don't have one
		if(locale === '') {

			// Go through acceptable languages
			for(const s of window.navigator.languages) {
				if(s in LOCALES) {
					locale = LOCALES[s]
					break;
				}
			}

			// If we still don't have a locale
			if(locale === '') {
				locale = 'fr-CA';
			}
		}

		// Set the locale
		this.set(locale);

		// Subscribe to notifications about users
		this.user = false;
		subscribe(user => {
			this.user = user;
		});
	}

	/**
	 * Set
	 *
	 * Overrides the Subscribe set in order to also save it in local storage
	 *
	 * @name set
	 * @access public
	 * @param {str} locale The locale to set and save for reloads
	 * @returns void
	 */
	set(locale) {

		// Set it in a cookie
		cookies.set('locale', locale)

		// If we have a user
		if(this.user && this.user.locale !== locale) {

			// Tell the server the user wants to change their locale
			brain.update('user', { locale }).then(data => {
				update();
			});
		}

		// Call the parent set
		super.set(locale);
	}
}

// Create the one instance and export it
const Locale = new _Locale();
export default Locale;