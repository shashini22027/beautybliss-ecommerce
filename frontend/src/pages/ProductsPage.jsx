import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import SidebarFilters from '../components/SidebarFilters';
import API from '../services/api';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = selectedCat ? `/products?category=${selectedCat}` : '/products';
        const { data } = await API.get(url);
        let sorted = [...data];
        if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
        setProducts(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [selectedCat, sortBy]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-64 flex-shrink-0">
        <SidebarFilters categories={categories} activeCategory={selectedCat} onSelectCategory={setSelectedCat} />
      </div>
      <div className="flex-grow space-y-4">
        <div className="flex justify-end">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-stone-200 rounded p-1.5 text-xs bg-white focus:outline-none">
            <option value="">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(prod => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
