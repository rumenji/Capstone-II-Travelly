import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('should render the spinner and loading text', () => {
    render(<Spinner />);

    // Assert the spinner element is in the document
    const spinnerElement = screen.getByRole('status'); 
    expect(spinnerElement).toBeInTheDocument();

    // Assert the loading text
    const loadingText = screen.getByText('Loading...');
    expect(loadingText).toBeInTheDocument();

    expect(spinnerElement).toHaveClass('spinner'); 
  });
});