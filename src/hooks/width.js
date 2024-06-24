import { useEffect, useState } from 'react';
const WIDTHS = {
	'xs': 0,
	'sm': 600,
	'md': 900,
	'lg': 1200,
	'xl': 1536
}
export function compare(a, b) {
	if(a === b) return 0;
	if(WIDTHS[a] < WIDTHS[b]) return -1;
	return 1;
}
export function greaterThan(a, b) {
	return WIDTHS[a] > WIDTHS[b];
}
export function lessThan(a, b) {
	return WIDTHS[a] < WIDTHS[b];
}
function getWidth() {
	if(document.documentElement.clientWidth < 600) { return 'xs' }
	if(document.documentElement.clientWidth < 900) { return 'sm' }
	if(document.documentElement.clientWidth < 1200) { return 'md' }
	if(document.documentElement.clientWidth < 1536) { return 'lg' }
	return 'xl';
}
export function useWidth() {
	const [width, widthSet] = useState(getWidth())
	useEffect(() => {
		let resize = () => widthSet(getWidth());
		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		}
	}, []);
	return width;
}
const width = { compare, greaterThan, lessThan, useWidth }
export default width;