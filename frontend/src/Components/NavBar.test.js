import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './NavBar';
import { renderWithProviders } from '../utils/testUtils';

describe('NavBar', () => {
    it('should render the login button if no user', () => {
        const initialState = {
            auth: {
            }
        }

        renderWithProviders(<Router><NavBar /></Router>, { preloadedState: initialState })

        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('should show trips as a button in the navbar if user', async () => {
        const initialState = {
            auth: {
                userInfo: {
                    first_name: 'John',
                },
                loading: false,
            }
        }

        renderWithProviders(<Router><NavBar /></Router>, { preloadedState: initialState })

        const trips = screen.getByText('Trips');
        const home = screen.getByText('Home');

        expect(trips).toBeInTheDocument();
        expect(home).toBeInTheDocument();

    });
});