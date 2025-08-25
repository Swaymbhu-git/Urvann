import React from 'react';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  type = 'error',
  showRetry = true 
}) => {
  return (
    <div className={`error-message ${type}`}>
      <div className="error-icon">
        {type === 'error' ? '⚠️' : type === 'warning' ? '⚡' : 'ℹ️'}
      </div>
      
      <div className="error-content">
        <p className="error-text">{message}</p>
        
        {showRetry && onRetry && (
          <button 
            className="retry-button" 
            onClick={onRetry}
            type="button"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;