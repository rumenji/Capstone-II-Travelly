import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import './App.css';
import { TripsList } from './Components/Trips/TripsList';
import { AddTripForm } from './Components/Trips/TripAddForm';
import { currentUser } from './thunks';
import LoginForm from './Auth/LoginForm';
import RegisterForm from './Auth/RegisterForm';
import NavBar from './Components/NavBar';
import ProtectedRoute from './Auth/ProtectedRoute';
import ProfileScreen from './Auth/ProfileScreen';
import HomeScreen from './Components/HomeScreen';
import TripDetails from './Components/Trips/TripDetails';
import DayDetails from './Components/Days-Places/DayDetails';
import NotFound from './Components/NotFound';

/**App component - fetches current user if token is available in the cookies */
function App() {
  const { userInfo, userToken, loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!loading && !error & !userInfo && userToken) dispatch(currentUser(userToken))
  }, [userInfo, userToken, loading, error, dispatch])

  return (
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<HomeScreen />} />
          {/* All routes below are protected - require a logged in user */}
          <Route element={<ProtectedRoute />}>
            <Route path='/account' element={<ProfileScreen />} />
            <Route path="/trips" element={<TripsList />} />
            <Route path="/add-trip" element={<AddTripForm />} />
            <Route path="/trips/:tripId/" element={<TripDetails />} />
            <Route path="/trips/:tripId/:dayId" element={<DayDetails />} />
          </Route>
          {/* Catch all not found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;