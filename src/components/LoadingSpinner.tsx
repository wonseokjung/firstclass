import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-text">Loading FirstClass...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 