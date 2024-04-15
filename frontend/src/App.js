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
import PredictiveSearch from './Components/Trips/LocationSearch';
import HomeScreen from './Components/HomeScreen';
import TripDetails from './Components/Trips/TripDetails';
import DayDetails from './Components/Days-Places/DayDetails';
import { fetchTrips } from './thunks';
import MyTable from './Components/Trips/editTable';
import NotFound from './Components/NotFound';

function App() {
  const { userInfo, userToken, loading, error } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  
  useEffect(() => {
    if(!loading && !error & !userInfo && userToken) dispatch(currentUser(userToken))
  }, [userInfo, userToken, loading, error, dispatch])
 
  return (
    <BrowserRouter>
      
        <div className="App">
          <NavBar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path='/account' element={<ProfileScreen />} />
            <Route path="/trips" element={<TripsList />} />
            <Route path="/add-trip" element={<AddTripForm />} />
            <Route path="/search" element={<PredictiveSearch />} />
            <Route path="/trips/:tripId/" element={<TripDetails />} />
            <Route path="/trips/:tripId/:dayId" element={<DayDetails />} />
            <Route path="/edit-table" element={<MyTable />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
      
    </BrowserRouter>
  );
}

export default App;