import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SidebarFilters from '../components/SidebarFilters';
import API from '../services/api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');

  // Read filter values from URL Search Params
  const selectedCat = searchParams.get('category') || '';
  const selectedSubcat = searchParams.get('subcategory') || '';
  const selectedColor = searchParams.get('color') || '';
  const selectedCountry = searchParams.get('country') || '';

  // Helper setters to update URL Search Params
  const setCategoryParam = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) nextParams.set('category', val);
    else nextParams.delete('category');
    setSearchParams(nextParams);
  };

  const setSubcatParam = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) nextParams.set('subcategory', val);
    else nextParams.delete('subcategory');
    setSearchParams(nextParams);
  };

  const setColorParam = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) nextParams.set('color', val);
    else nextParams.delete('color');
    setSearchParams(nextParams);
  };

  const setCountryParam = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) nextParams.set('country', val);
    else nextParams.delete('country');
    setSearchParams(nextParams);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (selectedCat) queryParams.append('category', selectedCat);
        if (selectedSubcat) queryParams.append('subcategory', selectedSubcat);
        if (selectedColor) queryParams.append('color', selectedColor);
        if (selectedCountry) queryParams.append('country', selectedCountry);

        const { data } = await API.get(`/products?${queryParams.toString()}`);
        let sorted = [...data];
        if (sortBy === 'price-low') sorted.sort((a, b) => a.price - b.price);
        else if (sortBy === 'price-high') sorted.sort((a, b) => b.price - a.price);
        setProducts(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [selectedCat, selectedSubcat, selectedColor, selectedCountry, sortBy]);

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
        <SidebarFilters
          categories={categories}
          activeCategory={selectedCat}
          onSelectCategory={setCategoryParam}
          activeSubcategory={selectedSubcat}
          onSelectSubcategory={setSubcatParam}
          activeColor={selectedColor}
          onSelectColor={setColorParam}
          activeCountry={selectedCountry}
          onSelectCountry={setCountryParam}
        />
      </div>
      <div className="flex-grow space-y-4">
        <div className="flex justify-between items-center bg-white border border-pink-50 p-4 rounded-2xl">
          <span className="text-xs text-stone-500 font-medium">{products.length} Products Found</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-stone-200 rounded p-1.5 text-xs bg-white focus:outline-none">
            <option value="">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-pink-50 rounded-2xl">
            <p className="text-stone-400 font-serif italic text-sm">No cosmetics match your selected filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
