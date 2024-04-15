
import React from 'react';
import "./Spinner.css"
const Spinner = () => {
  return (
    <div className="spinning-wheel">
      <div className="spinner" role='status'></div>
      <h2>Loading...</h2>
    </div>
  );
};
export default Spinner;