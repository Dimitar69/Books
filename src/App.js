import React, { useState, useEffect } from 'react';
import Search from './components/Search';
import Sort from './components/Sort';
import NoResults from './components/NoResults';
import booksJson from './books.json';
import booksCsv from './books.csv';
import './App.css';
import Book from './components/Book';

const parseCSV = (str) => {
  const rows = str.trim().split('\n');
  const headers = rows[0].split(',');
  return rows.slice(1).map((row) => {
    const values = row.split(',');
    return headers.reduce((object, header, index) => {
      object[header.trim()] = values[index].trim();
      return object;
    }, {});
  });
};

const mergeData = async () => {
  const csvData = await fetch(booksCsv).then((res) => res.text());
  const parsedCsv = parseCSV(csvData);

  const mergedData = booksJson.map((book) => ({
    ...book,
    ...parsedCsv.find((item) => item.id === String(book.id)),
  }));

  return mergedData;
};

const App = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const mergedBooks = await mergeData();
      setBooks(mergedBooks);
      setFilteredBooks(mergedBooks);
    };
    fetchData();
  }, []);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    const filtered = books.filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()) || book.genre.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredBooks(filtered);
  };

  const handleSortChange = (sortOption) => {
    const sorted = [...filteredBooks].sort((a, b) => a[sortOption].localeCompare(b[sortOption]));
    setFilteredBooks(sorted);
  };

  return (
    <div className="app">
      <div className="header">
        <div className="header-text">ENTERPRISE LEAGUE</div>
        <Search onSearch={handleSearch} />
      </div>
      <div className="content">
        <Sort onSortChange={handleSortChange} />
        {filteredBooks.length ? (
          <div className="book-list">
            {filteredBooks.map((book) => (
              <Book
                key={book.id}
                title={book.title}
                author={book.author}
                genre={book.genre}
                query={query}
              />
            ))}
          </div>
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
};

export default App;
