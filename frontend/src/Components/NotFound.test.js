import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from './NotFound';

describe('NotFound', () => {
    it('should render the correct heading when type is "trip"', () => {
        render(<NotFound type="trip" />, { wrapper: MemoryRouter });

        expect(screen.getByText('Trip Not Found')).toBeInTheDocument();
    });

    it('should render the correct heading and message for default case', () => {
        render(<NotFound />, { wrapper: MemoryRouter }); // No type specified

        expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
        expect(screen.getByText('Oops! Something went wrong.')).toBeInTheDocument();
    });

    // Test the Link component
    it('should have a link to the home page', () => {
        render(<NotFound />, { wrapper: MemoryRouter });

        const link = screen.getByRole('link', { name: /go back to home/i });
        expect(link).toHaveAttribute('href', '/');
    });
});