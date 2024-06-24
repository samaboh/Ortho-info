/**
 * Header
 *
 * Handles title and menu
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright DevMedika Inc.
 * @created 2023-05-16
 */

// Ouroboros modules
import body from '@ouroboros/body';
import { signout, useUser } from '@ouroboros/brain-react';
import { cookies } from '@ouroboros/browser';
import events from '@ouroboros/events';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Project components
import Modal from 'components/elements/Modal';

// Local components
import Forgot from './Forgot';
import History from './History';
import MyAccount from './MyAccount';
import Search from './Search';
import Need from './Need';
import SignIn from './SignIn';
import SignUp from './SignUp';

// Project modules
import Locale from 'tools/locale';

// Project hooks
import { useWidth } from 'hooks/width';

// Text
import TEXT from 'translations/header';
import clone from '@ouroboros/clone';

// Constants
const MENU_LISTS = {
	'en-CA': ['/conditions', '/about', '/blog', '/contact'],
	'fr-CA': ['/conditions', '/apropos', '/blog', '/contact']
};

/**
 * Header
 *
 * Top of the page
 *
 * @name Header
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Header(props) {

	// State
	const [history, historySet] = useState(false);
	const [need, needSet] = useState({});
	const [modal, modalSet] = useState(false);
	const [menuOpen, menuOpenSet] = useState(false)
	const [showSearch, showSearchSet] = useState(false)

	// Hooks
	const location = useLocation();
	const user = useUser();

	// Load effect
	useEffect(() => {
		// Subscribe to signin_show events
		const oSubscribe = events.get('signin_show').subscribe(() => {
			modalSet('signin');
		});

		// Unsubscribe
		return () => {
			oSubscribe.unsubscribe();
		}
	}, []);

	// User effect
	useEffect(() => {
		if(user) {
			body.read('professional', 'need').then(
				needSet,
				error => events.get('error').trigger(error)
			)
		} else {
			modalSet(false);
		}
	}, [user]);

	useEffect(() => {
		//show search bar on home page
		location.pathname === "/" ? showSearchSet(true) : showSearchSet(false);
		//add className for condition page sticky buttons
		if (location.pathname.substring(0, 11) === '/condition/') {
			document.querySelector("#share-consultation").classList.add('share-consultation')
		} else {
			document.querySelector("#share-consultation").classList.remove('share-consultation')
		}
	}, [location]);


	// Called to show the My Account popup
	function myAccount(ev) {

		// Stop normal action of the click
		ev.preventDefault();
		ev.stopPropagation();

		// Open the sign in page
		modalSet('myaccount')
	}

	// Called to show the sign in popup
	function signIn(ev) {

		// Stop normal action of the click
		ev.preventDefault();
		ev.stopPropagation();

		// Open the sign in page
		modalSet('signin')
	}

	// Called to sign the current user out
	function signOut(ev) {

		// Stop normal action of the click
		ev.preventDefault();
		ev.stopPropagation();

		// Call the signout
		signout().then(data => {
			cookies.remove('_session');
		});
	}

	// Text
	const _ = TEXT[props.locale];

	// Render
	return (
		<React.Fragment>
			<div id="header" className='flexStatic flexColumns'>
				<div className="container">
					<div className="navigation flexColumns">
						<div className="flexStatic logo-container">
							<Link to="/">
								<img
									className="logo"
									src="https://orthoinfo.s3.us-east-1.amazonaws.com/www/logo_side.png"
									alt="logo"
								/>
							</Link>
						</div>
						<div className={ "nav-menu" + ( menuOpen ? " expanded" : "") }>
							{props.locale && props.locale in MENU_LISTS && MENU_LISTS[props.locale].map(s =>
								<Link key={s} to={s} onClick={() => menuOpenSet(false)} className={location.path === s ? 'selected' : ''}>{_.menu[s]}</Link>
							)}
							{user ?
								<React.Fragment>
									<Link
										to="#"
										title={_.myaccount}
										onClick={myAccount}
									>{_.myaccount}</Link>
									<Link
										to="#"
										title={_.history}
										onClick={ev => {
											ev.preventDefault();
											ev.stopPropagation();
											historySet(true);
										}}
									>{_.history}</Link>
									<Link
										to="#"
										title={_.signout}
										onClick={signOut}
									>{_.signout}</Link>
								</React.Fragment>
							:
								<Link
									to="#"
									title={_.signin}
									onClick={signIn}
								>{_.signin}</Link>
							}
						</div>
						<div className="flex hamburger-container">
							<div className="flexStatic">
								{props.locale === 'en-CA' ?
									<img
										className="link"
										onClick={() => Locale.set('fr-CA')}
										src="https://orthoinfo.s3.us-east-1.amazonaws.com/www/en_btn.svg"
										alt="fr"
									/>
								:
									<img
										className="link"
										onClick={() => Locale.set('en-CA')}
										src="https://orthoinfo.s3.us-east-1.amazonaws.com/www/fr_btn.svg"
										alt="en"
									/>
								}
							</div>

							{/* mobile menu button */}
							<button
								type='button'
								className="hamburger"
								aria-label='toggle menu'
								onClick={() => menuOpenSet(!menuOpen)}
								>
								<i className="fa-solid fa-bars fa-xl"></i>
							</button>
						</div>
					</div>
					{showSearch &&
					<div className="search">
						<Search
							location={location}
							{...props}
						/>
					</div>
					}
				</div>
			</div>
			{need.length ?
				<Need
					locale={props.locale}
					onTaskDone={task =>
						needSet(val => {
							const i = val.indexOf(task);
							if(i > -1) {
								const l = clone(val);
								l.splice(i, 1);
								return l;
							} else {
								return val;
							}
						})
					}
					tasks={need}
				/>
			:
				<Modal
					onClose={() => modalSet(false)}
					open={modal !== false}
				>
					{(modal === 'forgot' &&
						<Forgot
							{...props}
							onChange={modalSet}
						/>
					) || (modal === 'myaccount' &&
						<MyAccount
							{...props}
						/>
					) || (modal === 'signin' &&
						<SignIn
							{...props}
							onChange={modalSet}
						/>
					) || (modal === 'signup' &&
						<SignUp
							{...props}
							onChange={modalSet}
						/>
					)}
				</Modal>
			}
			{user &&
				<History
					locale={props.locale}
					onClose={() => historySet(false)}
					open={history}
				/>
			}
		</React.Fragment>

	);
}

// Valid props
Header.propTypes = {
	locale: PropTypes.string.isRequired
}