import React from 'react';

const highlightMatches = (text, query) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={index}
        className="book-list__item--highlighted"
      >
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const Book = ({ title, author, genre, query }) => {
  return (
    <div className="book-list__item">
      <p>Title: {highlightMatches(title, query)}</p>
      <p>Author: {highlightMatches(author, query)}</p>
      <p>Genre: {highlightMatches(genre, query)}</p>
    </div>
  );
};
export default Book;
