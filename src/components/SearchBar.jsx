import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleQuickSearch = (quickQuery) => {
    setQuery(quickQuery);
    onSearch(quickQuery);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books by title..."
            className="search-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="search-button"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? '🔍' : '🔎'}
          </button>
        </div>
      </form>

      <div className="quick-searches">
        <span className="quick-search-label">Quick searches:</span>
        <button
          onClick={() => handleQuickSearch('Harry Potter')}
          className="quick-search-btn"
          disabled={isLoading}
        >
          Harry Potter
        </button>
        <button
          onClick={() => handleQuickSearch('Lord of the Rings')}
          className="quick-search-btn"
          disabled={isLoading}
        >
          Lord of the Rings
        </button>
        <button
          onClick={() => handleQuickSearch('Pride and Prejudice')}
          className="quick-search-btn"
          disabled={isLoading}
        >
          Pride and Prejudice
        </button>
        <button
          onClick={() => handleQuickSearch('The Great Gatsby')}
          className="quick-search-btn"
          disabled={isLoading}
        >
          The Great Gatsby
        </button>
        <button
          onClick={() => handleQuickSearch('1984')}
          className="quick-search-btn"
          disabled={isLoading}
        >
          1984
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
