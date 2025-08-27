import { useState } from 'react';
import BookCard from './BookCard';
import './FavoritesPanel.css';

const FavoritesPanel = ({ favorites, onRemoveFromFavorites, onViewDetails, isOpen, onToggle }) => {
  const [sortBy, setSortBy] = useState('dateAdded');

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'author':
        return (a.author_name?.[0] || '').localeCompare(b.author_name?.[0] || '');
      case 'year':
        return (b.first_publish_year || 0) - (a.first_publish_year || 0);
      case 'rating':
        return (b.ratings_average || 0) - (a.ratings_average || 0);
      case 'dateAdded':
      default:
        return b.dateAdded - a.dateAdded;
    }
  });

  const clearAllFavorites = () => {
    if (window.confirm('Are you sure you want to remove all favorites?')) {
      favorites.forEach(book => onRemoveFromFavorites(book.key));
    }
  };

  const exportFavorites = () => {
    const favoritesData = favorites.map(book => ({
      title: book.title,
      author: book.author_name?.join(', ') || 'Unknown',
      year: book.first_publish_year,
      isbn: book.isbn?.[0],
      openLibraryUrl: `https://openlibrary.org${book.key}`
    }));

    const dataStr = JSON.stringify(favoritesData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-favorite-books.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`favorites-panel ${isOpen ? 'open' : ''}`}>
      <div className="favorites-header">
        <button className="toggle-favorites" onClick={onToggle}>
          {isOpen ? '✕' : '❤️'} 
          <span className="favorites-count">({favorites.length})</span>
        </button>
      </div>

      {isOpen && (
        <div className="favorites-content">
          <div className="favorites-title">
            <h2>My Reading List</h2>
            <p>{favorites.length} book{favorites.length !== 1 ? 's' : ''} saved</p>
          </div>

          {favorites.length > 0 && (
            <div className="favorites-controls">
              <div className="sort-controls">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="dateAdded">Date Added</option>
                  <option value="title">Title</option>
                  <option value="author">Author</option>
                  <option value="year">Publication Year</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <div className="action-controls">
                <button onClick={exportFavorites} className="export-btn">
                  📥 Export List
                </button>
                <button onClick={clearAllFavorites} className="clear-btn">
                  🗑️ Clear All
                </button>
              </div>
            </div>
          )}

          <div className="favorites-list">
            {favorites.length === 0 ? (
              <div className="empty-favorites">
                <div className="empty-icon">📚</div>
                <h3>No favorites yet</h3>
                <p>Start building your reading list by clicking the heart icon on any book!</p>
              </div>
            ) : (
              <div className="favorites-grid">
                {sortedFavorites.map((book) => (
                  <BookCard
                    key={book.key}
                    book={book}
                    isFavorite={true}
                    onRemoveFromFavorites={onRemoveFromFavorites}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPanel;
