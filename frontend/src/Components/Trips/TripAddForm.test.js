import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderWithProviders } from '../../utils/testUtils';
import { AddTripForm } from './TripAddForm';

describe('Trip', () => {
    it('should render the trip add form', () => {

        renderWithProviders(<Router><AddTripForm /></Router>)

        expect(screen.getByPlaceholderText('Name of your trip')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

});