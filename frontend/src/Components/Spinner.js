import React from 'react';
import "./Spinner.css"

/**Spinner component for data loading for save buttons*/
export const SpinnerButton = () => {
  return (
    <div className="spinning-wheel-button">
      <div className="spinner-button" role='status'></div>
    </div>
  );
};

/**Spinner component for data loading for full pages*/
const Spinner = () => {
  return (
    <div className="spinning-wheel">
      <div className="spinner" role='status'></div>
      <h2>Loading...</h2>
    </div>
  );
};
export default Spinner;