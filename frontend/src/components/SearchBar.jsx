import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearchSubmit }) => {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      onSearchSubmit(keyword);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search for skincare, cosmetics..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full bg-white border border-pink-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
      />
      <Search className="absolute left-3.5 top-3.5 text-stone-400" size={16} />
    </form>
  );
};

export default SearchBar;
