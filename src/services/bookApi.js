const BASE_URL = 'https://openlibrary.org';

export const searchBooks = async (query) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search.json?title=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      books: data.docs || [],
      totalResults: data.numFound || 0,
      start: data.start || 0
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to search books. Please try again.');
  }
};

export const getBookDetails = async (workKey) => {
  try {
    const response = await fetch(`${BASE_URL}${workKey}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to get book details.');
  }
};

export const getCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

export const getAuthorDetails = async (authorKey) => {
  try {
    const response = await fetch(`${BASE_URL}/authors/${authorKey}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching author details:', error);
    return null;
  }
};
