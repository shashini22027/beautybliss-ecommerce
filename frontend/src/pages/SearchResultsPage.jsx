import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import API from '../services/api';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await API.get(`/products?keyword=${keyword}`);
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (keyword) fetchResults();
  }, [keyword]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif font-bold text-stone-900">
        Search Results for: <span className="text-primary-700 italic">"{keyword}"</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map(prod => (
          <ProductCard key={prod._id} product={prod} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
