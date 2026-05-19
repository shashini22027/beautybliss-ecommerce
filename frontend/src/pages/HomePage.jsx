import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategoryCards from '../components/CategoryCards';
import FeaturedProducts from '../components/FeaturedProducts';
import API from '../services/api';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await API.get('/products');
        const catRes = await API.get('/categories');
        setProducts(prodRes.data.slice(0, 4));
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16">
      <HeroBanner />
      <CategoryCards categories={categories} />
      <FeaturedProducts products={products} />
    </div>
  );
};

export default HomePage;
