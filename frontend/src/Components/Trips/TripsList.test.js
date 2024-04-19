import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderWithProviders } from '../../utils/testUtils';
import { TripsList } from './TripsList';

describe('TripsList', () => {
    it('should render the trips list for the user', () => {
        const initialState = {
            trips: {
                tripsList: [{
                    "id": 23,
                    "name": "Trip to Budapest",
                    "from_date": "2024-03-30T04:00:00.000Z",
                    "to_date": "2024-04-02T04:00:00.000Z",
                    "location_name": "Budapest",
                    "loc_long": "19.04055",
                    "loc_lat": "47.49814",
                    "days": [
                        {
                            "id": 131,
                            "name": "03-30"
                        },
                        {
                            "id": 132,
                            "name": "03-31"
                        },
                        {
                            "id": 133,
                            "name": "04-01"
                        },
                        {
                            "id": 134,
                            "name": "04-02"
                        }
                    ]
                }], loading_trips: false, error_trips: null, success_trips: true
            }
        }

        renderWithProviders(<Router><TripsList /></Router>, { preloadedState: initialState })

        expect(screen.getByText('Trip to Budapest')).toBeInTheDocument();
        expect(screen.getByText('Apr 2')).toBeInTheDocument();
        expect(screen.queryByText('Apr 1')).not.toBeInTheDocument();
        const expandDays = screen.getByTestId('ExpandMoreIcon');
        fireEvent.click(expandDays)

        expect(screen.getByText('Apr 1')).toBeInTheDocument();

    });

});