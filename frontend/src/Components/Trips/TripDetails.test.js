import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { Route, MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../utils/testUtils';
import TripDetails from './TripDetails';

describe('TripDetails', () => {
    it('should render the trip details', () => {
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

        renderWithProviders(<MemoryRouter initialEntries={['/trips/2']}><Routes><Route path="/trips/:tripId" element={<TripDetails />} /></Routes></MemoryRouter>, { preloadedState: initialState })



        expect(screen.getByText('Trip to Paris Edited')).toBeInTheDocument();
        expect(screen.getByText('Jun 9')).toBeInTheDocument();
        expect(screen.queryByText('Apr 1')).not.toBeInTheDocument();

    });

    it('should render the loading spinner when loading is true', () => {
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
                }, loading_tripDetails: true, error_tripDetails: null, success_tripDetails: false, selectedDay: null
            }
        }

        renderWithProviders(<MemoryRouter initialEntries={['/trips/2']}><Routes><Route path="/trips/:tripId/" element={<TripDetails />} /></Routes></MemoryRouter>, { preloadedState: initialState })

        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});