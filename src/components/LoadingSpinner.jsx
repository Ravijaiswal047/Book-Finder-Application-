import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Searching for books..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="book-animation">
          <div className="book-page"></div>
          <div className="book-page"></div>
          <div className="book-page"></div>
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
