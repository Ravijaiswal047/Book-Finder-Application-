import { useState, useEffect } from 'react';
import { getCoverUrl, getBookDetails } from '../services/bookApi';
import './BookModal.css';

const BookModal = ({ book, isOpen, onClose, onAddToFavorites, onRemoveFromFavorites, isFavorite }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen && book) {
      setLoading(true);
      getBookDetails(book.key)
        .then(details => {
          setBookDetails(details);
        })
        .catch(error => {
          console.error('Failed to load book details:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, book]);

  if (!isOpen || !book) return null;

  const coverUrl = getCoverUrl(book.cover_i, 'L');
  const defaultCover = 'https://via.placeholder.com/300x400/667eea/white?text=No+Cover';

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.join(', ');
  };

  const formatISBN = (isbn) => {
    if (!isbn || isbn.length === 0) return 'Not available';
    return isbn[0];
  };

  const formatPublishers = (publishers) => {
    if (!publishers || publishers.length === 0) return 'Unknown Publisher';
    return publishers.slice(0, 3).join(', ');
  };

  const handleFavoriteClick = () => {
    if (isFavorite) {
      onRemoveFromFavorites(book.key);
    } else {
      onAddToFavorites(book);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-body">
          <div className="modal-cover-section">
            <img
              src={imageError || !coverUrl ? defaultCover : coverUrl}
              alt={`Cover of ${book.title}`}
              className="modal-cover"
              onError={() => setImageError(true)}
            />
            <button
              className={`modal-favorite-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteClick}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>

          <div className="modal-info-section">
            <h1 className="modal-title">{book.title}</h1>
            <h2 className="modal-author">by {formatAuthors(book.author_name)}</h2>

            <div className="modal-meta">
              {book.first_publish_year && (
                <div className="meta-item">
                  <strong>First Published:</strong> {book.first_publish_year}
                </div>
              )}
              
              {book.ratings_average && (
                <div className="meta-item">
                  <strong>Rating:</strong> 
                  <span className="rating-display">
                    ⭐ {book.ratings_average.toFixed(1)}
                    {book.ratings_count && ` (${book.ratings_count} reviews)`}
                  </span>
                </div>
              )}

              {book.number_of_pages_median && (
                <div className="meta-item">
                  <strong>Pages:</strong> {book.number_of_pages_median}
                </div>
              )}

              <div className="meta-item">
                <strong>ISBN:</strong> {formatISBN(book.isbn)}
              </div>

              {book.publisher && (
                <div className="meta-item">
                  <strong>Publisher:</strong> {formatPublishers(book.publisher)}
                </div>
              )}

              {book.language && (
                <div className="meta-item">
                  <strong>Languages:</strong> {book.language.join(', ')}
                </div>
              )}
            </div>

            {book.subject && book.subject.length > 0 && (
              <div className="modal-subjects">
                <strong>Genres & Subjects:</strong>
                <div className="subjects-list">
                  {book.subject.slice(0, 10).map((subject, index) => (
                    <span key={index} className="subject-tag-modal">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-details">
                <div className="spinner"></div>
                Loading additional details...
              </div>
            )}

            {bookDetails && bookDetails.description && (
              <div className="modal-description">
                <strong>Description:</strong>
                <p>
                  {typeof bookDetails.description === 'string' 
                    ? bookDetails.description 
                    : bookDetails.description.value || 'No description available'}
                </p>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="action-btn primary"
                onClick={() => window.open(`https://openlibrary.org${book.key}`, '_blank')}
              >
                📖 View on Open Library
              </button>
              
              {book.isbn && book.isbn[0] && (
                <button 
                  className="action-btn secondary"
                  onClick={() => window.open(`https://www.google.com/search?q=buy+book+isbn+${book.isbn[0]}`, '_blank')}
                >
                  🛒 Find to Buy
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
