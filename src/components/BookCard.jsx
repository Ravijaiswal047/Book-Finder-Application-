import { useState } from 'react';
import { getCoverUrl } from '../services/bookApi';
import './BookCard.css';

const BookCard = ({ book, onAddToFavorites, onRemoveFromFavorites, isFavorite, onViewDetails }) => {
  const [imageError, setImageError] = useState(false);

  const coverUrl = getCoverUrl(book.cover_i, 'M');
  const defaultCover = 'https://via.placeholder.com/200x300/667eea/white?text=No+Cover';

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.slice(0, 2).join(', ') + (authors.length > 2 ? '...' : '');
  };

  const formatSubjects = (subjects) => {
    if (!subjects || subjects.length === 0) return [];
    return subjects.slice(0, 3);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      onRemoveFromFavorites(book.key);
    } else {
      onAddToFavorites(book);
    }
  };

  return (
    <div className="book-card" onClick={() => onViewDetails(book)}>
      <div className="book-cover-container">
        <img
          src={imageError || !coverUrl ? defaultCover : coverUrl}
          alt={`Cover of ${book.title}`}
          className="book-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <button
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        
        <p className="book-author">
          by {formatAuthors(book.author_name)}
        </p>

        <div className="book-meta">
          {book.first_publish_year && (
            <span className="publish-year">{book.first_publish_year}</span>
          )}
          
          {book.ratings_average && (
            <div className="rating">
              <span className="stars">⭐</span>
              <span className="rating-value">
                {book.ratings_average.toFixed(1)}
              </span>
              {book.ratings_count && (
                <span className="rating-count">
                  ({book.ratings_count})
                </span>
              )}
            </div>
          )}
        </div>

        {book.subject && formatSubjects(book.subject).length > 0 && (
          <div className="book-subjects">
            {formatSubjects(book.subject).map((subject, index) => (
              <span key={index} className="subject-tag">
                {subject}
              </span>
            ))}
          </div>
        )}

        {book.number_of_pages_median && (
          <p className="page-count">
            📖 {book.number_of_pages_median} pages
          </p>
        )}

        <div className="book-actions">
          <button className="view-details-btn">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
