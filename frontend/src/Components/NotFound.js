import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({type}) => {
  return (
    <div className="not-found">
      {type === 'trip' 
        ? <h1>Trip Not Found</h1>
        : <h1>404 - Page Not Found</h1>
      }
      <h1>Item Not Found</h1>
      <p>Oops! Something went wrong.</p>
      <Link to="/">Go back to home</Link>
    </div>
  );
};

export default NotFound;