import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderWithProviders } from '../../utils/testUtils';
import { TripEditForm } from './TripEditForm';

describe('Trip', () => {
    it('should render the trip edit form', () => {
        const initialState = {
            tripDetails: {
                tripDetails: {
                    "id": 2,
                    "name": "Trip to Paris Edited",
                    "location_name": "Paris",
                    "loc_long": "2.3522",
                    "loc_lat": "48.8566",
                    "from_date": "2024-06-08T04:00:00.000Z",
                    "to_date": "2024-06-11T04:00:00.000Z",
                    "user_username": "test",
                    "days": [
                        {
                            "id": 137,
                            "name": "06-08"
                        },
                        {
                            "id": 138,
                            "name": "06-09"
                        },
                        {
                            "id": 139,
                            "name": "06-10"
                        },
                        {
                            "id": 140,
                            "name": "06-11"
                        }
                    ]
                }, loading_tripDetails: false, error_tripDetails: null, success_tripDetails: true, selectedDay: null
            }
        }
        renderWithProviders(<Router><TripEditForm /></Router>, { preloadedState: initialState })


        expect(screen.getByPlaceholderText('Name of your trip')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Trip to Paris Edited')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
        expect(screen.getByText('Discard')).toBeInTheDocument();
    });

});