import { render, screen } from '@testing-library/react';
import Site from './components/Site';

test('renders learn react link', () => {
	render(<Site />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});