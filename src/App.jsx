import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import BookCard from './components/BookCard'
import BookModal from './components/BookModal'
import LoadingSpinner from './components/LoadingSpinner'
import FavoritesPanel from './components/FavoritesPanel'
import { searchBooks } from './services/bookApi'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [searchInfo, setSearchInfo] = useState({ query: '', type: '', totalResults: 0 })

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bookFinder_favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('bookFinder_favorites', JSON.stringify(favorites))
  }, [favorites])

  const handleSearch = async (query) => {
    setLoading(true)
    setError(null)
    setBooks([])
    
    try {
      const result = await searchBooks(query)
      setBooks(result.books)
      setSearchInfo({
        query,
        type: 'title',
        totalResults: result.totalResults
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToFavorites = (book) => {
    const bookWithDate = {
      ...book,
      dateAdded: Date.now()
    }
    setFavorites(prev => [...prev, bookWithDate])
  }

  const handleRemoveFromFavorites = (bookKey) => {
    setFavorites(prev => prev.filter(book => book.key !== bookKey))
  }

  const isFavorite = (bookKey) => {
    return favorites.some(book => book.key === bookKey)
  }

  const handleViewDetails = (book) => {
    setSelectedBook(book)
  }

  const handleCloseModal = () => {
    setSelectedBook(null)
  }

  const toggleFavorites = () => {
    setShowFavorites(prev => !prev)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            📚 Book Finder
            <span className="app-subtitle">Discover your next great read</span>
          </h1>
        </div>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} isLoading={loading} />

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {searchInfo.query && !loading && (
          <div className="search-results-info">
            <p>
              Found <strong>{searchInfo.totalResults.toLocaleString()}</strong> results for 
              <strong> "{searchInfo.query}"</strong>
            </p>
            {books.length < searchInfo.totalResults && (
              <p className="results-note">
                Showing first {books.length} results
              </p>
            )}
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && books.length > 0 && (
          <div className="books-grid">
            {books.map((book) => (
              <BookCard
                key={book.key}
                book={book}
                onAddToFavorites={handleAddToFavorites}
                onRemoveFromFavorites={handleRemoveFromFavorites}
                isFavorite={isFavorite(book.key)}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {!loading && !error && books.length === 0 && searchInfo.query && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No books found</h3>
            <p>Try searching with different keywords or check your spelling.</p>
            <div className="search-suggestions">
              <p>Suggestions:</p>
              <ul>
                <li>Try searching by author name</li>
                <li>Use broader terms (e.g., "fantasy" instead of "epic fantasy adventure")</li>
                <li>Check for typos in book titles</li>
                <li>Try searching by ISBN for specific books</li>
              </ul>
            </div>
          </div>
        )}

        {!loading && !error && books.length === 0 && !searchInfo.query && (
          <div className="welcome-message">
            <div className="welcome-icon">📖</div>
            <h2>Welcome to Book Finder!</h2>
            <p>Search for books by title to get started.</p>
            <div className="welcome-features">
              <div className="feature">
                <span className="feature-icon">🔍</span>
                <span>Advanced Search Options</span>
              </div>
              <div className="feature">
                <span className="feature-icon">❤️</span>
                <span>Save Favorites</span>
              </div>
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Detailed Book Information</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <FavoritesPanel
        favorites={favorites}
        onRemoveFromFavorites={handleRemoveFromFavorites}
        onViewDetails={handleViewDetails}
        isOpen={showFavorites}
        onToggle={toggleFavorites}
      />

      <BookModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={handleCloseModal}
        onAddToFavorites={handleAddToFavorites}
        onRemoveFromFavorites={handleRemoveFromFavorites}
        isFavorite={selectedBook ? isFavorite(selectedBook.key) : false}
      />
    </div>
  )
}

export default App
