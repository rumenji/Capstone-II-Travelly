import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { renderWithProviders } from '../../utils/testUtils';
import { Trip } from './Trip';

describe('Trip', () => {
  it('should render the trip', () => {
      const props = {
        "id": 2,
        "name": "Trip to Paris Edited",
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
    }
     renderWithProviders(<Router><Trip id={props.id} name={"Trip to Paris Edited"} days={props.days} /></Router>)
     
   

    expect(screen.getByText('Trip to Paris Edited')).toBeInTheDocument();
    expect(screen.getByText('Jun 8')).toBeInTheDocument();
    expect(screen.queryByText('Jun 9')).not.toBeInTheDocument();
    const expandDays = screen.getByTestId('ExpandMoreIcon');
    fireEvent.click(expandDays)

    expect(screen.getByText('Jun 9')).toBeInTheDocument();

  });

});