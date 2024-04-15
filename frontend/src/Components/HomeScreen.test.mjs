import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from '../store/store';
import HomeScreen from './HomeScreen';

describe('HomeScreen', () => {
  it('should render the loading spinner when loading is true', () => {
    const store = configureStore({
      auth: {
        userInfo: null,
        loading: true,
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <HomeScreen />
        </Router>
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render welcome message and the "Let\'s plan your next trip?" button when loading is false', async () => {
    const store = configureStore({
      auth: {
        userInfo: {
          first_name: 'John',
        },
        loading: false,
      },
    });

    render(
      <Provider store={store}>
        <Router>
          <HomeScreen />
        </Router>
      </Provider>
    );

    const welcomeMessage = screen.getByText('Welcome back, John!');
    const planTripButton = screen.getByText('Let\'s plan your next trip?');

    expect(welcomeMessage).toBeInTheDocument();
    expect(planTripButton).toBeInTheDocument();

    // Test the button click event
    fireEvent.click(planTripButton);

    // Use waitFor to wait for the navigation to complete
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /add trip/i })).toBeInTheDocument();
    });
  });
});