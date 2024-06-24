import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import Site from './components/Site';
import { SnackbarProvider } from 'react-snackbar-alert';

ReactDOM.render(
	<React.StrictMode>
		<SnackbarProvider position="bottom">
			<Site />
		</SnackbarProvider>
	</React.StrictMode>,
	document.getElementById('react_root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();