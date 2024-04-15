// ProtectedRoute.js
import { useSelector } from 'react-redux'
import { NavLink, Outlet } from 'react-router-dom'
import ErrorAlert from '../Components/ErrorAlert'

const ProtectedRoute = () => {
  const { userInfo, error } = useSelector((state) => state.auth)
  if(error) {
    return <ErrorAlert error={error} />
  }
  // show unauthorized screen if no user is found in redux store
  if (!userInfo) {
    return (
      <div className='unauthorized'>
        <h1>Unauthorized</h1>
        <span>
          <NavLink to='/login'>Login</NavLink> to gain access
        </span>
      </div>
    )
  }

  // returns child route elements
  return <Outlet />
}
export default ProtectedRoute