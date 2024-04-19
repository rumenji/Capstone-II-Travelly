import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import HomeScreen from './HomeScreen';
import { renderWithProviders } from '../utils/testUtils';

describe('HomeScreen', () => {
  it('should render the loading spinner when loading is true', () => {
    const initialState = {
      auth: {
        userInfo: {
          first_name: 'John',
        },
        loading: true,
      }}
      
     renderWithProviders(<Router><HomeScreen /></Router>, {preloadedState: initialState})
     
   

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render welcome message and the "Let\'s plan your next trip?" button when loading is false', async () => {
    const initialState = {
      auth: {
        userInfo: {
          first_name: 'John',
        },
        loading: false,
      }}

    renderWithProviders(<Router><HomeScreen /></Router>, {preloadedState: initialState})

    const welcomeMessage = screen.getByText('Welcome back, John!');
    const planTripButton = screen.getByText('Let\'s plan your next trip?');

    expect(welcomeMessage).toBeInTheDocument();
    expect(planTripButton).toBeInTheDocument();

  });
});